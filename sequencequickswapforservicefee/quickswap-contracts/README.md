## `QuickswapSyrupPools.sol`

This contract replaces the `StakingRewards.sol` contract for Quickswap Syrup Pools. It uses the same logic for staking but provides many possible user-interface improvements by enabling multiple actions to occur in a single transaction.

### Architecture Change

With `StakingRewards.sol` a separate contract is deployed for each Syrup Pool. This is changed with the new `QuickswapSyrupPools.sol` contract. With `QuickswapSyrupPools.sol` a single contract is deployed that contains any number of Syrup Pools.  Note that this is different than the [megapool](https://github.com/QuickSwap/megapool) contract which provides a single pool with many possible reward tokens.

After `QuickswapSyrupPools.sol` is deployed any number of Syrup Pools can be added to it.  Each Syrup Pool is associated with one reward token. People stake dQUICK into a Syrup Pool and earn reward tokens from one ERC20 contract.

This change of architecture enables easier on-chain management and tracking of all Syrup Pools and enables an action to occur on multiple Syrup Pools in a single transaction. For example it enables a person to stake their dQUICK into multiple Syrup Pools in a single transaction.

### New Functionality

The `QuickswapSyrupPools.sol` contract offers various new functionality that can see in the descriptions of functions below.

New staking and unstaking functionality:

1. A user can stake dQUICK into multiple Syrup Pools in a single transaction.
2. A user can convert QUICK to dQUICK and stake it into multiple Syrup Pools in a single transaction.
3. A user can withdraw specific amounts of dQUICK from multiple Syrup Pools in a single transaction.
4. A user can withdraw specific amounts dQUICK from multiple Syrup Pools and convert it to QUICK in a single transaction.
5. A user can withdraw all her dQUICK from all Syrup Pools she has staked in, in a single transaction.
6. A user can withdraw all her dQUICK from all Syrup Pools she has staked in, and automatically convert it into QUICK in a single transaction.
7. A user can claim rewards (getRewards) from multiple Syrup Pools in a single transaction.
8. A user can claim rewards (getRewards) from all Syrup Pools she has rewards in,  in a single transaction.
9. A user can withdraw specific amounts of dQUICK from multiple Syrup Pools and claim rewards from those Syrup Pools in a single transaction.
10. A user can withdraw specific amounts dQUICK from multiple Syrup Pools and convert it to QUICK and claim rewards from those Syrup Pools in a single transaction.
11. A user can withdraw all her dQUICK from all Syrup Pools she has staked in and claim rewards from those Syrup Pools, in a single transaction.
12. A user can withdraw all her dQUICK from all Syrup Pools she has staked in and claim rewards from those Syrup Pools , and automatically convert the dQUICK into QUICK in a single transaction.

New read-only, on-chain functionality:
1. The `totalSupply()` function returns the total staked dQUICK across all Syrup Pools.
2. The `totalSupply(address _rewardToken)` function returns the total dQUICK staked in a specific Syrup Pool.
3. The `balanceOf(address _rewardToken, address _account)` function returns the total dQUICK staked in a specific Syrup Pool by a specific staker.
4. The `balanceOf(address _account)` function returns the total dQUICK staked in all Syrup Pools by a specific staker.
5. The `pool(address _rewardToken)` function returns information about a specific Syrup Pool.
6. The `pools()` function returns information about all Syrup Pools.
7. The `stakerPool(address _rewardToken, address _staker)` function returns staker information about a specific Syrup Pool and specific staker, including how much dQUICK the staker staked and how many reward tokens are available for claiming.
8. The `stakerPools(address _staker)` function returns staker information about all Syrup Pools that the staker has dQUICK staked in or has rewards available in.

Adding new Syrup Pools

1. The `notifyRewardAmount(RewardInfo[] calldata _rewards) external onlyOwner` function enables the owner of the contract to add new Syrup Pools.

### Staking
#### `stake(StakeInput[] calldata _stakes)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakeInput {
    address rewardToken;
    uint256 amount;        
}
 
function stake(StakeInput[] calldata _stakes) external;
```

The `stake` function enables people to stake dQUICK into one or more Syrup Pools in a single transaction.

This function requires that a user approves the `QuickswapSyrupPools` contract to transfer dQUICK on their behalf.

---
#### `enterDragonLairAndStake(QuickStakeInput[] calldata _quickStakeInput)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct QuickStakeInput {
    address rewardToken;
    uint256 quickAmount;
}
    
function enterDragonLairAndStake(QuickStakeInput[] calldata _quickStakeInput)
```

The `enterDragonLairAndStake` function enables users to stake QUICK into one or more Syrup Pools.  It automatically converts QUICK into dQUICK and stakes it. This function saves the user the trouble of having to first convert their QUICK to dQUICK before staking.

This function requires that a user approves the `QuickswapSyrupPools` contract to transfer QUICK on their behalf. Note that it does not require the user to approve `QuickswapSyrupPools` for transferring dQUICK.

---
### Withdrawing

Note that withdrawing returns dQUICK back to its owner but does not claim any rewards.
#### `withdraw(StakeInput[] calldata _stakes)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakeInput {
    address rewardToken;
    uint256 amount;        
}

function withdraw(StakeInput[] calldata _stakes) external;
```

The `withdraw(StakeInput[] calldata _stakes)` function enables a user to remove a specified amount of dQUICK from one or more Syrup Pools in a single transaction.

---
#### `withdrawAndDragonLair(StakeInput[] calldata _stakes)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakeInput {
    address rewardToken;
    uint256 amount;        
}

function withdrawAndDragonLair(StakeInput[] calldata _stakes) external;
```

The `withdrawAndDragonLair(StakeInput[] calldata _stakes)` function enables a user to remove a specified amount of dQUICK from one or more Syrup Pools and automatically converts it to QUICK and transfers it to the user, all in a single transaction.

---
#### `withdrawAll(address[] calldata _rewardTokens)`

The `withdrawAll(address[] calldata _rewardTokens)` function enables a user to remove all their staked dQUICK from one or more Syrup Pools.

---

#### `withdrawAllAndDragonLair(address[] calldata _rewardTokens)`

The `withdrawAllAndDragonLair(address[] calldata _rewardTokens)` function enables a user to remove all their dQUICK from one or more Syrup Pools and automatically converts it to QUICK and transfers it to the user, all in a single transaction.

---
#### `withdrawAllFromAll()`

The `withdrawAllFromAll()` function enables a user to remove all their staked dQUICK from all Syrup Pools in a single transaction.

---
### Claiming Rewards
#### `getRewards(address[] calldata _rewardTokens)`

The `getRewards(address[] calldata _rewardTokens)` function enables a user to claim reward tokens from one or more Syrup Pools in a single transaction. 

---
#### `getAllRewards()`

The `getAllRewards()` function enables a user to claim reward tokens from all the Syrup Pools the user has rewards in, in a single transaction.

---
### Exit functions
Note: These functions enable a user to remove staked dQUICK and claim reward tokens from one or more Syrup Pools in a single transaction.

#### `exit(StakeInput[] calldata _stakes)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakeInput {
    address rewardToken;
    uint256 amount;        
}

function exit(StakeInput[] calldata _stakes) external;
```

The `exit(StakeInput[] calldata _stakes)` function enables a user to unstake a specified amount of dQUICK for each specified Syrup Pool and claim reward tokens from those Syrup Pools.

---

#### `exitAndDragonLair(StakeInput[] calldata _stakes)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakeInput {
    address rewardToken;
    uint256 amount;        
}

function exitAndDragonLair(StakeInput[] calldata _stakes);
```

The `exit(StakeInput[] calldata _stakes)` function enables a user to unstake a specified amount of dQUICK for each specified Syrup Pool and claim reward tokens from those Syrup Pools. The unstaked dQUICK is automatically converted to QUICK and transferred to the user. This is all done in a single transaction.

---

#### `exitAll(address[] calldata _rewardTokens)`

The `exitAll(address[] calldata _rewardTokens)` function enables a user to unstake all his staked dQUICK for each specified Syrup Pool and claim reward tokens from those Syrup Pools. 

---

#### `exitAllAndDragonLair(address[] calldata _rewardTokens)`

The `exitAllAndDragonLair(address[] calldata _rewardTokens)` function enables a user to unstake all his staked dQUICK for each specified Syrup Pool and claim reward tokens from those Syrup Pools. The unstaked dQUICK is automatically converted to QUICK and transferred to the user. This is all done in a single transaction.

---

#### `exitAllFromAll()`

The `exitAllFromAll()` function enables a user to unstake all her staked dQUICK for all Syrup Pools she has dQUICK staked in and claim reward tokens from those Syrup Pools. 

---

#### `exitAllFromAllAndDragonLair()`

The `exitAllFromAllAndDragonLair()` function enables a user to unstake all her staked dQUICK for all Syrup Pools she has dQUICK staked in and claim reward tokens from those Syrup Pools. The unstaked dQUICK is automatically converted to QUICK and transferred to the user. This is all done in a single transaction.

---

### Adding Syrup Pools

#### `notifyRewardAmount(RewardInfo[] calldata _rewards) external onlyOwner`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct RewardInfo {
    address rewardToken;
    uint256 reward;
    uint256 rewardDuration;
}

function notifyRewardAmount(RewardInfo[] calldata _rewards) external onlyOwner {
```

The `notifyRewardAmount(RewardInfo[] calldata _rewards)` function is used to add Syrup Pools or extend or restart Syrup Pools.

---

### Removing Syrup Pools

#### `removeStakingPools(address[] calldata _rewardTokens) external onlyOwner`

This function is used to remove Syrup Pools from the internal array of Syrup Pools.

Removing Syrup Pools affects the return results of these functions:
* totalSupply()
* pools()

dQUICK cannot be staked into a Syrup Pool that has been removed.

Note that stakers can still withdraw, exit and claim from Syrup Pools that have been removed.

---
### Read Only Functions

#### `totalSupply()`

This returns the total amount of dQUICK that has been staked in all Syrup Pools.

---
####  `totalSupply(address _rewardToken)`

This returns the total amount of dQUICK that has been staked in a specific Syrup Pool.

#### `balanceOf(address _rewardToken, address _account)`

This returns the total amount of dQUICK staked in a specific Syrup Pool by a specific staker.

#### `balanceOf(address _account)`

This returns the total amount dQUICK staked in all Syrup Pools by a specific staker.

#### `quickBalanceOf(address _account)`

This returns the total amount dQUICK staked in all Syrup Pools by a specific staker and converts that to a QUICK amount.

This function is useful for voting apps like Snapshot when QUICK is used for voting.

#### `rewardPerToken(address _rewardToken)`

Returns the reward amount per dQUICK. This value increases until the reward period ends.

This function is used internally by other functions to determine reward payouts.

#### `earned(address _rewardToken, address _account)`

Returns the amount of reward tokens that can currently be claimed by a specific staker for a specific Syrup Pool.

#### `pool(address _rewardToken) public view returns (StakePool memory stakePool_)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakePool {
    address rewardToken; // address of reward token
    uint256 periodFinish; // when rewards will end
    uint256 totalSupply;  // how much dQUICK is staked
    uint256 rewardRate;   // rewards paid per second
    uint256 rewardPerToken; // How much is earned for each dQUICK.  This increases over time.
}
function pool(address _rewardToken) public view returns (StakePool memory stakePool_);
```
Provides information about a specific Syrup Pool.

#### `pools() external view returns (StakePool[] memory stakePools_)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakePool {
    address rewardToken; // address of reward token
    uint256 periodFinish; // when rewards will end
    uint256 totalSupply;  // how much dQUICK is staked
    uint256 rewardRate;   // rewards paid per second
    uint256 rewardPerToken; // How much is earned for each dQUICK.  This increases over time.
}

function pools() external view returns (StakePool[] memory stakePools_)
```
Returns information about all Syrup Pools.

---
#### `stakerPool(address _rewardToken, address _staker) public view returns (StakerPool memory stakerPool_)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakerPool {
    address rewardToken; // address of reward token
    address staker; // address of the staker
    uint256 periodFinish; // when rewards will end
    uint256 balance; // the amount of dQUICK the staker has staked for the Syrup Pool
    uint256 earned; // how much reward token is available for claiming
}

function stakerPool(address _rewardToken, address _staker) public view returns (StakerPool memory stakerPool_)
```
Returns staking information about a specific Syrup Pool for a specific staker.

---
#### `stakerPools(address _staker) external view returns (StakerPool[] memory stakerPools_)`
```Solidity
//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

struct StakerPool {
    address rewardToken; // address of reward token
    address staker; // address of the staker
    uint256 periodFinish; // when rewards will end
    uint256 balance; // the amount of dQUICK the staker has staked for the Syrup Pool
    uint256 earned; // how much reward token is available for claiming
}

function stakerPools(address _staker) external view returns (StakerPool[] memory stakerPools_)
```

Returns staking information for all Syrup Pools that a specific staker has dQUICK staked in or has rewards available to claim in.

---
## `QuickswapV1Router01.sol`

The regular router contract that Quickswap has used to swap tokens and add/remove liquidity is [UniswapV2Router02.sol](/contracts/UniswapV2Router02.sol).

The new [QuickswapV1Router01.sol](contracts/QuickswapV1Router01.sol) can be used instead of the `UniswapV2Router02.sol` contract.

The existing `UniswapV2Router02.sol` contract deployed [here](https://polygonscan.com/address/0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff) can still be used, however the new `QuickswapV1Router01.sol` function contains all the same functionality as `UniswapV2Router02.sol` plus additional functions.

The `QuickswapV1Router01.sol` contract inherits the `UniswapV2Router02.sol` contract so it contains the same exact code for the same exact functions as exists in `UniswapV2Router02.sol`.

`QuickswapV1Router01.sol` has these additional functions:

#### `addLiquidityAndStake`
```Solidity
function addLiquidityAndStake(
    address tokenA,
    address tokenB,
    uint amountADesired,
    uint amountBDesired,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline,
    address rewardPool
) external ensure(deadline) returns (uint amountA, uint amountB, uint liquidity)
```

This function is similar to the regular `addLiquidity` function but has the additional parameter `rewardPool`. This function adds liquidity to a Quickswap pool and stakes the returned LP token into a Quickswap reward pool. 

This function lets a person add liquidity and stake the LP tokens into a reward pool in a single transaction.


---
#### `addLiquidityETHAndStake`
```Solidity
function addLiquidityETHAndStake(
    address token,
    uint amountTokenDesired,
    uint amountTokenMin,
    uint amountETHMin,
    address to,
    uint deadline,
    address rewardPool
) external payable ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidity)
```

This function is similar to the regular `addLiquidityETH` function but has the additional parameter `rewardPool`. This function adds liquidity to a Quickswap pool and stakes the returned LP token into a Quickswap reward pool. 

This function lets a person add liquidity and stake the LP tokens into a reward pool in a single transaction.

---
#### `unstakeAndRemoveLiquidity`
```Solidity
 function unstakeAndRemoveLiquidity(
    address tokenA,
    address tokenB,        
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline,
    address rewardPool
) public ensure(deadline) returns (uint amountA, uint amountB) {
```

This function is similar to the regular `removeLiquidity` function but has the additional parameter `rewardPool`. This function unstakes LP tokens from a reward pool and then removes the liquidity from the Quickswap pool.

This function lets a person unstake and remove liquidity in a single transaction.

---
#### `unstakeAndRemoveLiquidityETH`
```Solidity
function unstakeAndRemoveLiquidityETH(
    address token,        
    uint amountTokenMin,
    uint amountETHMin,
    address to,
    uint deadline,
    address rewardPool
) external ensure(deadline) returns (uint amountToken, uint amountETH)
```

This function is similar to the regular `removeLiquidityETH` function but has the additional parameter `rewardPool`. This function unstakes LP tokens from a reward pool and then removes the liquidity from the Quickswap pool.

This function lets a person unstake and remove liquidity in a single transaction.

---
#### `unstakeAndRemoveLiquidityETHSupportingFeeOnTransferTokens`
```Solidity
function unstakeAndRemoveLiquidityETHSupportingFeeOnTransferTokens(
    address token,
    uint amountTokenMin,
    uint amountETHMin,
    address to,
    uint deadline,
    address rewardPool
) external ensure(deadline) returns (uint amountETH)
```

This function is similar to the regular `removeLiquidityETHSupportingFeeOnTransferTokens` function but has the additional parameter `rewardPool`. This function unstakes LP tokens from a reward pool and then removes the liquidity from the Quickswap pool.

This function lets a person unstake and remove liquidity in a single transaction.

---
## `StakingRewards2.sol`

[StakingRewards2.sol](contracts/StakingRewards2.sol) replaces [StakingRewards.sol](https://github.com/QuickSwap/quickswap-core/blob/master/contracts/staking/StakingRewards.sol).

This is the reward contract that Quickswap LP tokens are staked in to earn QUICK.

`StakingRewards2.sol` is a fork of `StakingRewards.sol`. `StakingRewards2.sol` contains only the code changes and code additions necessary to support the new functions provided by `QuickswapV1Router01.sol`.

The new `QuickswapV1Router01.sol` contract needs the ability to stake LP tokens for a user, and needs the ability to unstake LP tokens for a user. The new `StakingRewards2.sol` contract enables the `QuickswapV1Router01.sol` contract to do this.

The `StakingRewards2.sol` contract has modified `StakingRewards.sol` as little as possible to accommodate `QuickswapV1Router01.sol`.

The `StakingRewards2.sol` contract has the same functionality that works the same way as `StakingRewards.sol` contract and also has the following new functionality to support the `QuickswapV1Router01.sol` contract:


#### `StakingRewards2.sol constructor`
```Solidity
constructor(
    address _rewardsDistribution,
    address _rewardsToken,
    address _stakingToken,
    address _quickswapRouter
) public {
    rewardsToken = IERC20(_rewardsToken);
    stakingToken = IERC20(_stakingToken);
    rewardsDistribution = _rewardsDistribution;
    quickswapRouter = _quickswapRouter;
}
```

The constructor function has an additional `_quickswapRouter` parameter that is used to store the address of the deployed `QuickswapV1Router01.sol` contract. This is needed for the `StakingRewards2.sol` contract to authorize the `QuickswapV1Router01.sol` contract to unstake Quickswap LP tokens on the behalf of a user.

---
#### `stake(uint256 amount, address staker) external`

This function allows someone to stake tokens for another person or address. The tokens are transferred from `msg.sender` to the `StakingRewards2.sol` contract and assigned to `staker`.

The `addLiquidityAndStake` function from the `QuickswapV1Router01.sol` contract calls this function to stake LP tokens for a user.

There is no authorization on this function so anyone can stake tokens for any address.

---
#### `function quickswapRouterExit(address staker, address pair) external`

This function allows the `QuickswapV1Router01.sol` contract to unstake and claim rewards for a staker.

The `unstakeAndRemoveLiquidity` function from the `QuickswapV1Router01.sol` contract calls this function.

Only the `QuickswapV1Router01.sol` address specified by the `_quickswapRouter` parameter of the `StakingRewards2.sol` [constructor function](#stakingrewards2sol-constructor) can call this function.























