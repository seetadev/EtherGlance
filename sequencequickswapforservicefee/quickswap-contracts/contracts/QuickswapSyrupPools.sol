//SPDX-License-Identifier: MIT

// Author: Nick Mudge (@mudgen, nick@perfectabstractions, https://twitter.com/mudgen)

pragma solidity =0.8.9;

import {IERC20} from "./interfaces/IERC20.sol";
import {SafeERC20} from "./libraries/SafeERC20.sol";
import {IDragonLair} from "./interfaces/IDragonLair.sol";
import {SafeMath} from "./libraries/SafeMath.sol";

struct Staker {    
    uint256 balance; // total dQuick stakes for reward token
    uint256 userRewardPerTokenPaid; 
    uint256 reward; // reward available for claim
    
}

struct Staking {
    uint32 periodFinish; // when reward distribution is finished
    uint32 lastUpdateTime;
    uint32 index; // index into rewardTokens array
    uint256 totalSupply; // total amount of dQUICK staked for reward
    uint256 rewardRate; 
    uint256 rewardPerTokenStored;    
    // staker => staker info    
    mapping(address => Staker) stakers;    
}


struct AppStorage {
    address owner;
    mapping(address => Staking) staking;
    address[] rewardTokens; // list of staking pools
    // staker address => array of reward tokens
    mapping(address => address[]) stakerRewardTokens; 
    // staker address => rewardToken => index in stakerRewardTokens array
    mapping(address => mapping(address => uint256)) stakerRewardTokenIndex;
}

contract QuickswapSyrupPools {
    AppStorage s;

    using SafeMath for uint256;    
    
    IDragonLair constant public DRAGON_LAIR = IDragonLair(0xf28164A485B0B2C90639E47b0f377b4a438a16B1);
    address constant public QUICK = 0x831753DD7087CaC61aB5644b308642cc1c33Dc13;

    constructor(address _owner) {
        s.owner = _owner;
        IERC20(QUICK).approve(address(DRAGON_LAIR), type(uint256).max);
    }
    
    // read only functions //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////// 
    ///////////////////////////////////////////////////////////////// 

    function totalSupply() external view returns (uint256) {
        uint256 length = s.rewardTokens.length;        
        uint256 total;
        for(uint256 i; i < length; i++) {
            total += s.staking[s.rewardTokens[i]].totalSupply;
        }
        return total;
    }
    
    function totalSupply(address _rewardToken) external view returns (uint256) {
        return s.staking[_rewardToken].totalSupply;
    }  

    function balanceOf(address _rewardToken, address _account) external view returns (uint256) {
        return s.staking[_rewardToken].stakers[_account].balance;
    }

    function balanceOf(address _account) public view returns (uint256) {
        uint256 length = s.stakerRewardTokens[_account].length;
        uint256 totalDQuick;
        for(uint256 i; i < length; i++) {
            address rewardToken = s.stakerRewardTokens[_account][i];
            totalDQuick += s.staking[rewardToken].stakers[_account].balance;
        }
        return totalDQuick;
    }

    function quickBalanceOf(address _account) public view returns (uint256) {
        uint256 totalDQuick = balanceOf(_account);
        return DRAGON_LAIR.dQUICKForQUICK(totalDQuick);
    }


    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function lastTimeRewardApplicable(address _rewardToken) public view returns (uint256) {     
        return min(block.timestamp, s.staking[_rewardToken].periodFinish);
    }

    function rewardPerToken(address _rewardToken) public view returns (uint256) {
        Staking storage staking = s.staking[_rewardToken];
        if (staking.totalSupply == 0) {
            return staking.rewardPerTokenStored;
        }
        else {
            return
                staking.rewardPerTokenStored.add(
                    lastTimeRewardApplicable(_rewardToken).sub(staking.lastUpdateTime).mul(staking.rewardRate).mul(1e18).div(staking.totalSupply)
                );
        }
    }

    function earned(address _rewardToken, address _account) public view returns (uint256) {
        Staking storage staking = s.staking[_rewardToken];
        Staker storage staker = staking.stakers[_account];
        return staker.balance.mul(rewardPerToken(_rewardToken).sub(staker.userRewardPerTokenPaid)).div(1e18).add(staker.reward);        
    }

    struct StakePool {
        address rewardToken; // address of reward token
        uint256 periodFinish; // when rewards will end
        uint256 totalSupply;  // how much dQUICK is staked
        uint256 rewardRate;   // rewards paid per second
        uint256 rewardPerToken; // How much is earned for each dQUICK.  This increases over time.
    }

    function pool(address _rewardToken) public view returns (StakePool memory stakePool_) {
        Staking storage staking = s.staking[_rewardToken];
        stakePool_ = StakePool({
            rewardToken: _rewardToken,
            periodFinish: staking.periodFinish,
            totalSupply: staking.totalSupply,
            rewardRate: staking.rewardRate,
            rewardPerToken: rewardPerToken(_rewardToken)
        });
    }

    function pools() external view returns (StakePool[] memory stakePools_) {
        uint256 length = s.rewardTokens.length;
        stakePools_ = new StakePool[](length);
        for(uint256 i; i < length; i++) {
            address rewardToken = s.rewardTokens[i];
            stakePools_[i] = pool(rewardToken);
        }
    }

    struct StakerPool {
        address rewardToken; // address of reward token
        address staker; // address of the staker
        uint256 periodFinish; // when rewards will end
        uint256 balance; // the amount of dQUICK the staker has staked for the Syrup Pool
        uint256 earned; // how much reward token is available for claiming
    }

    function stakerPool(address _rewardToken, address _staker) public view returns (StakerPool memory stakerPool_) {
        Staking storage staking = s.staking[_rewardToken];
        Staker storage staker = staking.stakers[_staker];
        stakerPool_ = StakerPool({
            rewardToken: _rewardToken,
            staker: _staker,
            periodFinish: staking.periodFinish,
            balance: staker.balance,
            earned: earned(_rewardToken, _staker)
        });
    }

    function stakerPools(address _staker) external view returns (StakerPool[] memory stakerPools_) {
        uint256 length = s.stakerRewardTokens[_staker].length;
        stakerPools_ = new StakerPool[](length);
        for(uint256 i; i < length; i++) {
            stakerPools_[i] = stakerPool(s.stakerRewardTokens[_staker][i], _staker);
        }
    }

    // payment functions //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////// 
    ///////////////////////////////////////////////////////////////// 


    function payQuickFromDQuick(uint256 _amount) internal {
        if(_amount > 0) {
            uint256 quickAmount = DRAGON_LAIR.dQUICKForQUICK(_amount);
            DRAGON_LAIR.leave(_amount);
            SafeERC20.safeTransfer(QUICK, msg.sender, quickAmount);
        }        
    }

    function payDQuick(uint256 _amount) internal {
        if(_amount > 0) {
            SafeERC20.safeTransfer(address(DRAGON_LAIR), msg.sender, _amount);
        }
    }

    function enterDragonLair(uint256 _quickAmount) external {
        require(_quickAmount > 0 , "_quickAmount must be greater than 0");
        SafeERC20.safeTransferFrom(QUICK, msg.sender, address(this), _quickAmount);
        uint256 dQuick = DRAGON_LAIR.QUICKForDQUICK(_quickAmount);
        DRAGON_LAIR.enter(_quickAmount);
        payDQuick(dQuick);        
    }

    // staking functions ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////// 
    ///////////////////////////////////////////////////////////////// 

    function _stake(address _rewardToken, uint256 _amount) internal {                    
        require(_amount > 0, "Cannot stake 0");
        Staking storage staking = s.staking[_rewardToken];
        if(staking.index == 0) {
            require(s.rewardTokens[0] == _rewardToken, "rewardToken not authorized for staking");
        }
        updateReward(_rewardToken, msg.sender);            
        staking.totalSupply = staking.totalSupply + _amount;
        Staker storage staker = staking.stakers[msg.sender];
        uint256 balance = staker.balance;
        staker.balance = balance + _amount;
        if(balance == 0 && staker.reward == 0) {                
            s.stakerRewardTokenIndex[msg.sender][_rewardToken] = s.stakerRewardTokens[msg.sender].length;
            s.stakerRewardTokens[msg.sender].push(_rewardToken);
        }        
        emit Staked(_rewardToken, msg.sender, _amount);        
    }

    struct QuickStakeInput {
        address rewardToken;
        uint256 quickAmount;
    }
    
    function enterDragonLairAndStake(QuickStakeInput[] calldata _quickStakeInput) external {  
        uint256 dragonTotalSupply = DRAGON_LAIR.totalSupply();
        uint256 dragonQuickBalance = IERC20(QUICK).balanceOf(address(DRAGON_LAIR));        
        uint256 totalQuick;
        uint256 dQuickAmount;
        unchecked {
            for(uint i; i < _quickStakeInput.length; i++) {
                totalQuick += _quickStakeInput[i].quickAmount;
                if(dragonTotalSupply == 0 || dragonQuickBalance == 0) {
                    dQuickAmount = _quickStakeInput[i].quickAmount;
                }
                else {
                    dQuickAmount = (_quickStakeInput[i].quickAmount * dragonTotalSupply) / dragonQuickBalance;
                }
                _stake(_quickStakeInput[i].rewardToken, dQuickAmount);
            }
        }
        SafeERC20.safeTransferFrom(QUICK, msg.sender, address(this), totalQuick);
        DRAGON_LAIR.enter(totalQuick);
    }
    
    struct StakeInput {
        address rewardToken;
        uint256 amount;        
    }
 
    function stake(StakeInput[] calldata _stakes) external {
         uint256 totalStaked;
        for(uint256 i; i < _stakes.length; i++) {
            totalStaked += _stakes[i].amount;
            _stake(_stakes[i].rewardToken, _stakes[i].amount);
        }        
        SafeERC20.safeTransferFrom(address(DRAGON_LAIR), msg.sender, address(this), totalStaked);
    }

    // dQuick withdraw functions ////////////////////////////////////
    // The is removing staked dQuick but leaving any rewards unclaimed
    ///////////////////////////////////////////////////////////////// 
    /////////////////////////////////////////////////////////////////

    // This function contains the logic to withdraw dQUICK and claim rewards
    // It is used by the getBalance functions and the withdraw and exit functions.
    function takeOut(address _rewardToken, uint256 _amount, bool _isGetReward) internal {
        updateReward(_rewardToken, msg.sender);
        Staking storage staking = s.staking[_rewardToken];
        Staker storage staker = staking.stakers[msg.sender];
        uint256 stakerBalance = staker.balance;
        uint256 reward = staker.reward;        
        if(_amount == 0 && (_isGetReward == false || reward == 0)) {
            revert("Cannot withdraw 0 balance and claim 0 rewards");            
        }
        if(_amount > 0) {
            unchecked {        
                require(_amount <= stakerBalance, "Amount to withdraw is greater than balance");
                staking.totalSupply -= _amount;            
                staker.balance = stakerBalance - _amount;
            }
            emit Withdrawn(_rewardToken, msg.sender, _amount);
        }        
        if (_isGetReward == true && reward > 0) {
            staker.reward = 0;
            SafeERC20.safeTransfer(_rewardToken, msg.sender, reward);
            emit RewardPaid(_rewardToken, msg.sender, reward);
            reward = 0;
        }
        if(stakerBalance == _amount && reward == 0) {
            removeStakerStakingPool(_rewardToken);
        }
    }

    function removeStakerStakingPool(address _rewardToken) internal {
        uint256 lastIndex =  s.stakerRewardTokens[msg.sender].length - 1;
        uint256 index = s.stakerRewardTokenIndex[msg.sender][_rewardToken];        
        if(lastIndex != index) {
            address lastRewardToken = s.stakerRewardTokens[msg.sender][lastIndex];
            s.stakerRewardTokens[msg.sender][index] = lastRewardToken;
            s.stakerRewardTokenIndex[msg.sender][lastRewardToken] = index;
        }
        s.stakerRewardTokens[msg.sender].pop();
        delete s.stakerRewardTokenIndex[msg.sender][_rewardToken];
    }  

    function _withdraw(StakeInput[] calldata _stakes) internal returns (uint256 totalWithdrawAmount_) {
        for(uint256 i; i < _stakes.length; i++) {            
            uint256 amount = _stakes[i].amount;
            totalWithdrawAmount_ += amount;
            takeOut(_stakes[i].rewardToken, amount, false);            
        }
    }

    function withdraw(StakeInput[] calldata _stakes) external {
        uint256 totalWithdrawAmount = _withdraw(_stakes);
        payDQuick(totalWithdrawAmount); 
    }

    function withdrawAndDragonLair(StakeInput[] calldata _stakes) external {
        uint256 totalWithdrawAmount = _withdraw(_stakes);
        payQuickFromDQuick(totalWithdrawAmount);
    }

    function _withdrawAll(address[] calldata _rewardTokens) internal returns (uint256 totalWithdrawAmount_) {        
        for(uint256 i; i < _rewardTokens.length; i++) {
            address rewardToken = _rewardTokens[i];
            uint256 balance = s.staking[rewardToken].stakers[msg.sender].balance;
            totalWithdrawAmount_ += balance;
            takeOut(rewardToken, balance, false);
        }        
    }

    function withdrawAll(address[] calldata _rewardTokens) external {
        uint256 totalWithdrawAmount = _withdrawAll(_rewardTokens);
        payDQuick(totalWithdrawAmount);
    }

    function withdrawAllAndDragonLair(address[] calldata _rewardTokens) external {
        uint256 totalWithdrawAmount = _withdrawAll(_rewardTokens);
        payQuickFromDQuick(totalWithdrawAmount);
    }

    function _withdrawAllFromAll() internal returns (uint256 totalWithdrawAmount_) {
        address[] storage rewardTokens = s.stakerRewardTokens[msg.sender];                
        for(uint256 i = rewardTokens.length - 1;; i--) {
            address rewardToken = rewardTokens[i];
            uint256 balance = s.staking[rewardToken].stakers[msg.sender].balance;
            totalWithdrawAmount_ += balance;
            takeOut(rewardToken, balance, false);
            if(i == 0) {
                break;
            }
        }
    }

    function withdrawAllFromAll() external {
        uint256 totalWithdrawAmount = _withdrawAllFromAll();
        payDQuick(totalWithdrawAmount);
    }

    function withdrawAllFromAllAndDragonLair() external {
        uint256 totalWithdrawAmount = _withdrawAllFromAll();
        payQuickFromDQuick(totalWithdrawAmount);
    }

    // getRewards functions //////////////////////////////////////////
    // Gets any rewards but does not unstake dQuick
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    function getRewards(address[] calldata _rewardTokens) external {
        for(uint256 i; i < _rewardTokens.length; i++) {
            takeOut(_rewardTokens[i], 0, true);
        }        
    }

    function getAllRewards() external {        
        for(uint256 i = s.stakerRewardTokens[msg.sender].length - 1;; i--) {
            takeOut(s.stakerRewardTokens[msg.sender][i], 0, true);
            if(i == 0) {
                break;
            }
        }
    }

    // exit functions /////////////////////////////////////////////// 
    // These functions remove staked dQuick and claim rewards
    ///////////////////////////////////////////////////////////////// 
    ///////////////////////////////////////////////////////////////// 

    

    function _exit(StakeInput[] calldata _stakes) internal returns (uint256 totalWithdrawAmount_) {
        for(uint256 i; i < _stakes.length; i++) {
            StakeInput calldata l_stake = _stakes[i];
            totalWithdrawAmount_ += l_stake.amount;
            takeOut(l_stake.rewardToken, l_stake.amount, true);
        }        
    }

    function exit(StakeInput[] calldata _stakes) external {
        uint256 totalWithdrawAmount = _exit(_stakes);        
        payDQuick(totalWithdrawAmount);
    }

    function exitAndDragonLair(StakeInput[] calldata _stakes) external {
        uint256 totalWithdrawAmount = _exit(_stakes);        
        payQuickFromDQuick(totalWithdrawAmount);
    }

    function _exitAll(address[] calldata _rewardTokens) internal returns (uint256 totalWithdrawAmount_) {
        for(uint256 i; i < _rewardTokens.length; i++) {
            address rewardToken = _rewardTokens[i];
            uint256 balance = s.staking[rewardToken].stakers[msg.sender].balance;
            totalWithdrawAmount_ += balance;
            takeOut(rewardToken, balance, true);
        }
    }

    function exitAll(address[] calldata _rewardTokens) external {
        uint256 totalWithdrawAmount = _exitAll(_rewardTokens);
        payDQuick(totalWithdrawAmount);        
    }

    function exitAllAndDragonLair(address[] calldata _rewardTokens) external {
        uint256 totalWithdrawAmount = _exitAll(_rewardTokens);        
        payQuickFromDQuick(totalWithdrawAmount);
    }

    function _exitAllFromAll() internal returns (uint256 totalWithdrawAmount_) {
        address[] storage rewardTokens = s.stakerRewardTokens[msg.sender];                
        for(uint256 i = rewardTokens.length - 1;; i--) {
            address rewardToken = rewardTokens[i];
            uint256 balance = s.staking[rewardToken].stakers[msg.sender].balance;
            totalWithdrawAmount_ += balance;
            takeOut(rewardToken, balance, true);            
            if(i == 0) {
                break;
            }
        }
    }

    function exitAllFromAll() external {
        uint256 totalWithdrawAmount = _exitAllFromAll();
        payDQuick(totalWithdrawAmount);
    }

    function exitAllFromAllAndDragonLair() external {
        uint256 totalWithdrawAmount = _exitAllFromAll();              
        payQuickFromDQuick(totalWithdrawAmount);
    }

    // updateReward /////////////////////////////////////////////////
    // updates accounting for rewards
    ///////////////////////////////////////////////////////////////// 
    ///////////////////////////////////////////////////////////////// 

    function updateReward(address _rewardToken, address _account) internal {
        Staking storage staking = s.staking[_rewardToken];
        staking.rewardPerTokenStored = rewardPerToken(_rewardToken);
        staking.lastUpdateTime = uint32(lastTimeRewardApplicable(_rewardToken));
        if (_account != address(0)) {
            Staker storage staker = staking.stakers[_account];
            staker.reward = earned(_rewardToken, _account);
            staker.userRewardPerTokenPaid = staking.rewardPerTokenStored;
        }        
    }

    // admin functions used to add reward pools and remove reward pools
    /////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////// 
    ///////////////////////////////////////////////////////////////// 

    modifier onlyOwner {
        require(s.owner == msg.sender, "Not owner");
        _;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        emit OwnershipTransferred(s.owner, _newOwner);
        s.owner = _newOwner;
    }

    function owner() external view returns (address owner_) {
        owner_ = s.owner;
    }

    function addRewardToken(address _rewardToken) internal {
        uint256 index = s.staking[_rewardToken].index;
        if(index == 0 && s.rewardTokens[index] != _rewardToken) {
            s.staking[_rewardToken].index = uint32(s.rewardTokens.length);
            s.rewardTokens.push(_rewardToken);
        }
    }

    struct RewardInfo {
        address rewardToken;
        uint256 reward;
        uint256 rewardDuration;
    }

    // This function is used to add Syrup Pools or extend or restart their rewards
    function notifyRewardAmount(RewardInfo[] calldata _rewards) external onlyOwner {
        for(uint256 i; i < _rewards.length; i++) {
            RewardInfo calldata reward = _rewards[i];
            require(reward.rewardToken != address(0), "Reward token cannot be address(0)");
            addRewardToken(reward.rewardToken);
            updateReward(reward.rewardToken, address(0));
            Staking storage staking = s.staking[reward.rewardToken];
            require(block.timestamp.add(reward.rewardDuration) >= staking.periodFinish, "Cannot reduce existing period");
            
            uint256 rewardRate;
            if (block.timestamp >= staking.periodFinish) {
                rewardRate = reward.reward.div(reward.rewardDuration);
            } else {
                uint256 remaining = uint256(staking.periodFinish).sub(block.timestamp);
                uint256 leftover = remaining.mul(staking.rewardRate);
                rewardRate = reward.reward.add(leftover).div(reward.rewardDuration);
            }
            staking.rewardRate = rewardRate;

            // Ensure the provided reward amount is not more than the balance in the contract.
            // This keeps the reward rate in the right range, preventing overflows due to
            // very high values of rewardRate in the earned and rewardsPerToken functions;
            // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
            uint balance = IERC20(reward.rewardToken).balanceOf(address(this));
            require(rewardRate <= balance.div(reward.rewardDuration), "Provided reward too high");

            staking.lastUpdateTime = uint32(block.timestamp);
            uint256 periodFinish = block.timestamp.add(reward.rewardDuration);
            staking.periodFinish = uint32(periodFinish);
            emit RewardAdded(reward.rewardToken, reward.reward, periodFinish);
        }
    }

    function removeStakingPools(address[] calldata _rewardTokens) external onlyOwner {
        uint256 lastIndex = s.rewardTokens.length;
        for(uint256 i; i < _rewardTokens.length; i++) {
            address rewardToken = _rewardTokens[i];            
            uint256 index = s.staking[rewardToken].index;
            lastIndex--;
            if(index == 0) {
                require(s.rewardTokens[0] == rewardToken, "rewardToken not found");
            }
            if(lastIndex != index) {
                address lastRewardToken = s.rewardTokens[lastIndex];
                s.rewardTokens[index] = lastRewardToken;
                s.staking[lastRewardToken].index = uint32(index);
            }
            s.rewardTokens.pop();
            delete s.staking[rewardToken].index;
        }
    }   

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event RewardAdded(address indexed _rewardToken, uint256 _reward, uint256 _periodFinish);
    event Staked(address indexed _rewardToken, address indexed _staker, uint256 _amount);
    event Withdrawn(address indexed _rewardToken, address indexed _staker, uint256 _amount);
    event RewardPaid(address indexed _rewardToken, address indexed _staker, uint256 _reward);
    
  }
