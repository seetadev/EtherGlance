//SPDX-License-Identifier: MIT
pragma solidity =0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../otokens/interfaces/IOToken.sol";
import "../interfaces/IComptroller.sol";

contract BoostManager is Ownable {
    bool public init; //todo set to true when using proxy
    uint256 private constant MULTIPLIER = 10**18;

    IERC20 public veOVIX;
    IComptroller public comptroller;

    mapping(address => bool) public authorized;
    // market => user => supply boostBasis
    mapping(address => mapping(address => uint256)) public supplyBoosterBasis;
    // market => user => borrow boostBasis
    mapping(address => mapping(address => uint256)) public borrowBoosterBasis;
    // market => user => old supply balance deltas
    mapping(address => mapping(address => uint256))
        public oldSupplyBalanceDeltas;
    // market => user => old borrow balance deltas
    mapping(address => mapping(address => uint256))
        public oldBorrowBalanceDeltas;
    // user => veBalance
    mapping(address => uint256) public veBalances;

    mapping(address => uint256) private deltaTotalSupply;
    mapping(address => uint256) private deltaTotalBorrows;

    constructor(bool _init) {
        init = _init;
    }

    function initialize(
        IERC20 ve,
        IComptroller _comptroller,
        address _owner
    ) external {
        require(!init, "contract already initialized");
        init = true;
        veOVIX = ve;
        comptroller = _comptroller;
        _transferOwnership(_owner);
    }

    modifier onlyAuthorized() {
        require(
            authorized[msg.sender] || comptroller.isMarket(msg.sender),
            "sender is not authorized"
        );
        _;
    }

    /**
     * @notice Updates the boost basis of the user with the latest veBalance
     * @param user Address of the user which booster needs to be updated
     * @return The boolean value indicating whether the user still has the booster greater than 1.0
     */
    function updateBoostBasis(address user)
        external
        onlyAuthorized
        returns (bool)
    {
        IOToken[] memory markets = comptroller.getAllMarkets();

        veBalances[user] = veOVIX.balanceOf(user);
        for (uint256 i = 0; i < markets.length; i++) {
            _updateBoostBasisPerMarket(address(markets[i]), user);
        }

        return veBalances[user] == 0 ? false : true;
    }

    function _updateBoostBasisPerMarket(address market, address user) internal {
        uint256 userSupply = IOToken(market).balanceOf(user);
        uint256 userBorrows = IOToken(market).borrowBalanceStored(user);
        if (userSupply > 0) {
            comptroller.updateAndDistributeSupplierRewardsForToken(
                market,
                user
            );
            _updateSupplyBoostBasis(market, user);
            _updateBoostBalance(
                market,
                user,
                userSupply,
                supplyBoosterBasis[market][user],
                0
            );
        }
        if (userBorrows > 0) {
            comptroller.updateAndDistributeBorrowerRewardsForToken(
                market,
                user
            );
            _updateBorrowBoostBasis(market, user);
            _updateBoostBalance(
                market,
                user,
                userBorrows,
                borrowBoosterBasis[market][user],
                1
            );
        }
    }

    function _updateSupplyBoostBasis(address market, address user) internal {
        supplyBoosterBasis[market][user] = calcBoostBasis(market, 0);
        emit BoostBasisUpdated(
            user,
            market,
            supplyBoosterBasis[market][user],
            0
        );
    }

    function _updateBorrowBoostBasis(address market, address user) internal {
        borrowBoosterBasis[market][user] = calcBoostBasis(market, 1);
        emit BoostBasisUpdated(
            user,
            market,
            borrowBoosterBasis[market][user],
            1
        );
    }

    // call from oToken
    function updateBoostSupplyBalances(
        address market,
        address user,
        uint256 oldBalance, // todo: removing oldbalance: needs to be updated in oToken too. keep it until updating the oToken is necessary
        uint256 newBalance
    ) external onlyAuthorized {
        _updateBoostBalance(
            market,
            user,
            newBalance,
            supplyBoosterBasis[market][user],
            0
        );
    }

    function updateBoostBorrowBalances(
        address market,
        address user,
        uint256 oldBalance, // todo: removing oldbalance: needs to be updated in oToken too. keep it until updating the oToken is necessary
        uint256 newBalance
    ) external onlyAuthorized {
        _updateBoostBalance(
            market,
            user,
            newBalance,
            borrowBoosterBasis[market][user],
            1
        );
    }

    function _updateBoostBalance(
        address market,
        address user,
        uint256 newBalance,
        uint256 newBoostBasis,
        uint256 marketType
    ) internal {
        if (marketType == 0) {
            uint256 deltaOldBalance = oldSupplyBalanceDeltas[market][user];
            uint256 deltaNewBalance = calcBoostedBalance(
                user,
                newBoostBasis,
                newBalance
            ) - newBalance;

            uint256 newMarketDeltaTotalSupply = deltaTotalSupply[market] =
                deltaTotalSupply[market] +
                deltaNewBalance -
                deltaOldBalance;
            emit BoostedBalanceUpdated(
                user,
                market,
                deltaOldBalance,
                deltaNewBalance,
                newMarketDeltaTotalSupply,
                marketType
            );
            oldSupplyBalanceDeltas[market][user] = deltaNewBalance;
        } else {
            uint256 deltaOldBalance = oldBorrowBalanceDeltas[market][user];
            uint256 deltaNewBalance = calcBoostedBalance(
                user,
                newBoostBasis,
                newBalance
            ) - newBalance;

            uint256 newMarketDeltaTotalBorrows = deltaTotalBorrows[market] =
                deltaTotalBorrows[market] +
                deltaNewBalance -
                deltaOldBalance;
            emit BoostedBalanceUpdated(
                user,
                market,
                deltaOldBalance,
                deltaNewBalance,
                newMarketDeltaTotalBorrows,
                marketType
            );
            oldBorrowBalanceDeltas[market][user] = deltaNewBalance;
        }
    }

    // marketType: 0 = supply, 1 = borrow
    // boost basis = totalVeSupply/marketLiquidity
    function calcBoostBasis(address market, uint256 marketType)
        internal
        view
        returns (uint256)
    {
        require(marketType <= 1, "wrong market type");

        if (marketType == 0) {
            if (IOToken(market).totalSupply() == 0) return 0;
            return ((veOVIX.totalSupply() * MULTIPLIER) /
                IOToken(market).totalSupply());
        } else {
            if (IOToken(market).totalBorrows() == 0) return 0;
            return ((veOVIX.totalSupply() * MULTIPLIER) /
                IOToken(market).totalBorrows());
        }
    }

    // booster: if(veBalanceOfUser >= boostBasis * userBalance) = 2.5
    // booster: else: 1.5*veBalanceOfUser/(boostBasis * userBalance) + 1 = [1 <= booster < 2.5]
    // bosted balance = booster * userBalance
    function calcBoostedBalance(
        address user,
        uint256 boosterBasis,
        uint256 balance
    ) internal view returns (uint256) {
        if (veBalances[user] == 0 || boosterBasis == 0) return balance;

        uint256 minVe = (boosterBasis * balance) / MULTIPLIER;

        uint256 booster;

        if (veBalances[user] >= minVe) {
            booster = 25 * MULTIPLIER; // = 2,5
        } else {
            booster =
                ((15 * MULTIPLIER * veBalances[user]) / minVe) +
                10 *
                MULTIPLIER; // 1.5 * veBalance / minVe + 1;
        }
        return ((balance * booster) / (10 * MULTIPLIER));
    }

    function boostedSupplyBalanceOf(address market, address user)
        public
        view
        returns (uint256)
    {
        return (
            calcBoostedBalance(
                user,
                supplyBoosterBasis[market][user],
                IOToken(market).balanceOf(user)
            )
        );
    }

    function boostedBorrowBalanceOf(address market, address user)
        public
        view
        returns (uint256)
    {
        return (
            calcBoostedBalance(
                user,
                borrowBoosterBasis[market][user],
                IOToken(market).borrowBalanceStored(user)
            )
        );
    }

    function boostedTotalSupply(address market)
        external
        view
        returns (uint256)
    {
        return (IOToken(market).totalSupply() + deltaTotalSupply[market]);
    }

    function boostedTotalBorrows(address market)
        external
        view
        returns (uint256)
    {
        return (IOToken(market).totalBorrows() + deltaTotalBorrows[market]);
    }

    function setAuthorized(address addr, bool flag) external onlyOwner {
        authorized[addr] = flag;
        emit AuthorizedUpdated(addr, flag);
    }

    function isAuthorized(address addr) external view returns (bool) {
        return authorized[addr];
    }

    function setVeOVIX(IERC20 ve) external onlyOwner {
        veOVIX = ve;
        emit VeOVIXUpdated(veOVIX);
    }

    event BoostBasisUpdated(
        address indexed user,
        address indexed market,
        uint256 boostBasis,
        uint256 marketType
    );

    event BoostedBalanceUpdated(
        address indexed user,
        address indexed market,
        uint256 deltaOldBalance,
        uint256 deltaNewBalance,
        uint256 deltaTotal,
        uint256 marketType
    );

    event AuthorizedUpdated(address indexed addr, bool flag);
    event VeOVIXUpdated(IERC20 ve);
}
