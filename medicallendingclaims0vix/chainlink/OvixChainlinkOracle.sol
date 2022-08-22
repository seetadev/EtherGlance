//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../PriceOracle.sol";
import "../otokens/OErc20.sol";
import "../otokens/interfaces/IEIP20.sol";
import "../libraries/SafeMath.sol";
import "./interfaces/IAggregatorV2V3.sol";

contract OvixChainlinkOracle is PriceOracle {
    using SafeMath for uint;
    address public admin;
    string nativeSymbol;

    mapping(address => uint) internal prices;
    mapping(bytes32 => IAggregatorV2V3) internal feeds;
    event PricePosted(address asset, uint previousPriceMantissa, uint requestedPriceMantissa, uint newPriceMantissa);
    event NewAdmin(address oldAdmin, address newAdmin);
    event FeedSet(address feed, string symbol);

    constructor(string memory _nativeSymbol) {
        admin = msg.sender;
        nativeSymbol = _nativeSymbol;
    }

    function getUnderlyingPrice(IOToken oToken) public override view returns (uint) {
        string memory symbol = oToken.symbol();
        if (compareStrings(symbol, nativeSymbol)) {
            return getChainlinkPrice(getFeed(symbol));
        } else {
            return getPrice(oToken);
        }
    }

    function getPrice(IOToken oToken) internal view returns (uint price) {
        IEIP20 token = IEIP20(OErc20(address(oToken)).underlying());

        if (prices[address(token)] != 0) {
            price = prices[address(token)];
        } else {
            price = getChainlinkPrice(getFeed(token.symbol()));
        }

        uint decimalDelta = uint(18).sub(uint(token.decimals()));
        // Ensure that we don't multiply the result by 0
        if (decimalDelta > 0) {
            return price.mul(10**decimalDelta);
        } else {
            return price;
        }
    }

    function getChainlinkPrice(IAggregatorV2V3 feed) internal view returns (uint) {
        // Chainlink USD-denominated feeds store answers at 8 decimals
        uint decimalDelta = uint(18).sub(feed.decimals());
        // Ensure that we don't multiply the result by 0
        if (decimalDelta > 0) {
            return uint(feed.latestAnswer()).mul(10**decimalDelta);
        } else {
            return uint(feed.latestAnswer());
        }
    }

    function setUnderlyingPrice(IOToken oToken, uint underlyingPriceMantissa) external onlyAdmin {
        address asset = address(OErc20(address(oToken)).underlying());
        emit PricePosted(asset, prices[asset], underlyingPriceMantissa, underlyingPriceMantissa);
        prices[asset] = underlyingPriceMantissa;
    }

    function setDirectPrice(address asset, uint price) external onlyAdmin {
        emit PricePosted(asset, prices[asset], price, price);
        prices[asset] = price;
    }

    function setFeed(string calldata symbol, address feed) external onlyAdmin {
        require(feed != address(0) && feed != address(this), "invalid feed address");
        emit FeedSet(feed, symbol);
        feeds[keccak256(abi.encodePacked(symbol))] = IAggregatorV2V3(feed);
    }

    function getFeed(string memory symbol) public view returns (IAggregatorV2V3) {
        return feeds[keccak256(abi.encodePacked(symbol))];
    }

    function assetPrices(address asset) external view returns (uint) {
        return prices[asset];
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        address oldAdmin = admin;
        admin = newAdmin;

        emit NewAdmin(oldAdmin, newAdmin);
    }

    modifier onlyAdmin() {
      require(msg.sender == admin, "only admin may call");
      _;
    }
}
