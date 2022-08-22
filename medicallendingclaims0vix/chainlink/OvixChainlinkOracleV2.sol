//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../PriceOracle.sol";
import "../otokens/OErc20.sol";
import "../otokens/interfaces/IEIP20.sol";
import "../libraries/SafeMath.sol";
import "./interfaces/IAggregatorV2V3.sol";

contract OvixChainlinkOracleV2 is PriceOracle {
    using SafeMath for uint;

    address public admin;
    uint256 public validPeriod;
    address public oMatic;

    struct PriceData {
        uint256 price;
        uint256 updatedAt;
    }

    mapping(IAggregatorV2V3 => uint256) heartbeats;
    mapping(address => IAggregatorV2V3) internal feeds;
    mapping(address => PriceData) internal prices;

    event NewAdmin(address oldAdmin, address newAdmin);
    event FeedSet(address feed, address asset);
    event PricePosted(
        address asset,
        uint previousPrice,
        uint newPrice,
        uint256 updatedAt
    );
    event HeartbeatSet(address feed, uint256 heartbeat);
    event ValidPeriodSet(uint256 validPeriod);

    constructor(address _oMatic) {
        admin = msg.sender;
        validPeriod = 300; // 5 minutes
        setOMatic(_oMatic);
    }

    function getUnderlyingPrice(IOToken oToken)
        public
        view
        override
        returns (uint)
    {
        if (address(oToken) == oMatic) {
            return getChainlinkPrice(getFeed(address(oToken)));
        }
        return getPrice(oToken);
    }

    function getPrice(IOToken oToken) internal view returns (uint price) {
        IEIP20 token = IEIP20(OErc20(address(oToken)).underlying());

        IAggregatorV2V3 feed = getFeed(address(oToken));
        if (address(feed) != address(0)) {
            price = getChainlinkPrice(feed);
        } else if (
            prices[address(oToken)].updatedAt >= block.timestamp - validPeriod
        ) {
            price = prices[address(oToken)].price;
        }

        require(price > 0, "bad price");

        uint decimalDelta = uint(18).sub(uint(token.decimals()));
        // Ensure that we don't multiply the result by 0
        if (decimalDelta > 0) {
            return price.mul(10**decimalDelta);
        } else {
            return price;
        }
    }

    function getChainlinkPrice(IAggregatorV2V3 feed)
        internal
        view
        returns (uint)
    {
        // Chainlink USD-denominated feeds store answers at 8 decimals
        uint decimalDelta = uint(18).sub(feed.decimals());

        (, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();
        require(updatedAt > 0, "Round not complete");
        require(
            block.timestamp <= updatedAt.add((heartbeats[feed] * 15) / 10),
            "Update time (heartbeat) exceeded"
        );

        // Ensure that we don't multiply the result by 0
        if (decimalDelta > 0) {
            return uint(answer).mul(10**decimalDelta);
        } else {
            return uint(answer);
        }
    }

    function setUnderlyingPrice(
        address oToken,
        uint underlyingPriceMantissa,
        uint256 updatedAt
    ) external onlyAdmin {
        require(underlyingPriceMantissa > 0, "bad price");
        if (block.timestamp > updatedAt) {
            // reject stale price
            // validPeriod can be set to 5 mins
            require(block.timestamp - updatedAt < validPeriod, "bad updatedAt");
        } else {
            // reject future timestamp (< 3s is allowed)
            require(updatedAt - block.timestamp < 3, "bad updatedAt");
            updatedAt = block.timestamp;
        }

        emit PricePosted(
            oToken,
            prices[oToken].price,
            underlyingPriceMantissa,
            updatedAt
        );
        prices[oToken] = PriceData(underlyingPriceMantissa, updatedAt);
    }

    function setFeed(
        address oToken,
        address feed,
        uint256 heartbeat
    ) external onlyAdmin {
        require(
            feed != address(0) && feed != address(this),
            "invalid feed address"
        );
        heartbeats[IAggregatorV2V3(feed)] = heartbeat;
        feeds[oToken] = IAggregatorV2V3(feed);
        emit FeedSet(feed, oToken);
        emit HeartbeatSet(feed, heartbeat);
    }

    function setHeartbeat(address oToken, uint256 heartbeat)
        external
        onlyAdmin
    {
        heartbeats[feeds[oToken]] = heartbeat;
        emit HeartbeatSet(address(feeds[oToken]), heartbeat);
    }

    function getFeed(address oToken) public view returns (IAggregatorV2V3) {
        return feeds[oToken];
    }

    function setValidPeriod(uint256 period) external onlyAdmin {
        validPeriod = period;
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        address oldAdmin = admin;
        admin = newAdmin;

        emit NewAdmin(oldAdmin, newAdmin);
    }

    function setOMatic(address _oMatic) public onlyAdmin {
        oMatic = _oMatic;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin may call");
        _;
    }
}
