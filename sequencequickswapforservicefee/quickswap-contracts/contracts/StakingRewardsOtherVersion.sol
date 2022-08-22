// //SPDX-License-Identifier: MIT
// pragma solidity =0.6.6;

// import {IStakingRewards} from "./interfaces/IStakingRewards.sol";
// import {IERC20} from "./interfaces/IERC20.sol";
// import {SafeMath} from "./libraries/SafeMath.sol";

// /**
//  * @dev Standard math utilities missing in the Solidity language.
//  */
// library Math {
//     /**
//      * @dev Returns the largest of two numbers.
//      */
//     function max(uint256 a, uint256 b) internal pure returns (uint256) {
//         return a >= b ? a : b;
//     }

//     /**
//      * @dev Returns the smallest of two numbers.
//      */
//     function min(uint256 a, uint256 b) internal pure returns (uint256) {
//         return a < b ? a : b;
//     }

//     /**
//      * @dev Returns the average of two numbers. The result is rounded towards
//      * zero.
//      */
//     function average(uint256 a, uint256 b) internal pure returns (uint256) {
//         // (a + b) / 2 can overflow, so we distribute
//         return (a / 2) + (b / 2) + ((a % 2 + b % 2) / 2);
//     }
// }





// abstract contract RewardsDistributionRecipient {
//     address public rewardsDistribution;

//     function notifyRewardAmount(uint256 reward, uint256 duration) external virtual;

//     modifier onlyRewardsDistribution() {
//         require(msg.sender == rewardsDistribution, "Caller is not RewardsDistribution contract");
//         _;
//     }
// }

// contract StakingRewards is IStakingRewards, RewardsDistributionRecipient {
//     using SafeMath for uint256;    

//     address immutable public ROUTER;

//     /* ========== STATE VARIABLES ========== */

//     IERC20 public rewardsToken;    
//     uint256 public periodFinish = 0;
//     uint256 public rewardRate = 0;
//     uint256 public lastUpdateTime;
//     uint256 public rewardPerTokenStored;

//     mapping(address => uint256) public userRewardPerTokenPaid;
//     mapping(address => uint256) public rewards;

//     uint256 private _totalSupply;
//     mapping(address => uint256) private _balances;

//     /* ========== CONSTRUCTOR ========== */

//     constructor(
//         address _router,
//         address _rewardsDistribution,
//         address _rewardsToken        
//     ) public {
//         rewardsToken = IERC20(_rewardsToken);
//         rewardsDistribution = _rewardsDistribution;
//         ROUTER = _router;
//     }

//     /* ========== VIEWS ========== */

//     function totalSupply() external view override returns (uint256) {
//         return _totalSupply;
//     }

//     function balanceOf(address _account) external view override returns (uint256) {
//         return _balances[_account];
//     }

//     function lastTimeRewardApplicable() public view override returns (uint256) {
//         return Math.min(block.timestamp, periodFinish);
//     }

//     function rewardPerToken() public view override returns (uint256) {
//         if (_totalSupply == 0) {
//             return rewardPerTokenStored;
//         }
//         return
//             rewardPerTokenStored.add(
//                 lastTimeRewardApplicable().sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(_totalSupply)
//             );
//     }

//     function earned(address _account) public view override returns (uint256) {
//         return _balances[_account].mul(rewardPerToken().sub(userRewardPerTokenPaid[_account])).div(1e18).add(rewards[_account]);
//     }

//     /* ========== MUTATIVE FUNCTIONS ========== */

//     function stake(address _account, uint256 _amount) external override onlyRouter updateReward(_account) {
//         require(_amount > 0, "Cannot stake 0");
//         _totalSupply = _totalSupply.add(_amount);
//         _balances[_account] = _balances[_account].add(_amount);        
//         emit Staked(_account, _amount);
//     }

//     function withdraw(address _account, uint256 _amount) public override onlyRouter updateReward(_account) {
//         require(_amount > 0, "Cannot withdraw 0");
//         _totalSupply = _totalSupply.sub(_amount);
//         _balances[_account] = _balances[_account].sub(_amount);        
//         emit Withdrawn(_account, _amount);
//     }

//     function getReward(address _account) public override onlyRouter updateReward(_account) {
//         uint256 reward = rewards[_account];
//         if (reward > 0) {
//             rewards[_account] = 0;            
//             emit RewardPaid(_account, reward);
//         }
//     }

//     function exit(address _account) external override onlyRouter {
//         withdraw(_account, _balances[_account]);
//         getReward(_account);
//     }

//     /* ========== RESTRICTED FUNCTIONS ========== */

//     function notifyRewardAmount(uint256 reward, uint256 rewardsDuration) external override onlyRewardsDistribution updateReward(address(0)) {
//         require(block.timestamp.add(rewardsDuration) >= periodFinish, "Cannot reduce existing period");
        
//         if (block.timestamp >= periodFinish) {
//             rewardRate = reward.div(rewardsDuration);
//         } else {
//             uint256 remaining = periodFinish.sub(block.timestamp);
//             uint256 leftover = remaining.mul(rewardRate);
//             rewardRate = reward.add(leftover).div(rewardsDuration);
//         }

//         // Ensure the provided reward _amount is not more than the balance in the contract.
//         // This keeps the reward rate in the right range, preventing overflows due to
//         // very high values of rewardRate in the earned and rewardsPerToken functions;
//         // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
//         uint balance = rewardsToken.balanceOf(ROUTER);
//         require(rewardRate <= balance.div(rewardsDuration), "Provided reward too high");

//         lastUpdateTime = block.timestamp;
//         periodFinish = block.timestamp.add(rewardsDuration);
//         emit RewardAdded(reward, periodFinish);
//     }

//     /* ========== MODIFIERS ========== */

//     modifier updateReward(address _account) {
//         rewardPerTokenStored = rewardPerToken();
//         lastUpdateTime = lastTimeRewardApplicable();
//         if (_account != address(0)) {
//             rewards[_account] = earned(_account);
//             userRewardPerTokenPaid[_account] = rewardPerTokenStored;
//         }
//         _;
//     }

//     modifier onlyRouter() {
//         require(ROUTER == msg.sender, "Only router can call this function");
//         _;
//     }

//     /* ========== EVENTS ========== */

//     event RewardAdded(uint256 reward, uint256 periodFinish);
//     event Staked(address indexed user, uint256 _amount);
//     event Withdrawn(address indexed user, uint256 _amount);
//     event RewardPaid(address indexed user, uint256 reward);
// }
// interface IUniswapV2ERC20 {
//     function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
// }