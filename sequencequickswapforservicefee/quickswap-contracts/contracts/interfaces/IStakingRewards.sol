//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

// Inheritance
interface IStakingRewards {
    // Views
    function lastTimeRewardApplicable(address _rewardToken) external view returns (uint256);

    function rewardPerToken(address _rewardToken) external view returns (uint256);

    function earned(address _rewardToken, address _account) external view returns (uint256);

    function totalSupply(address _rewardToken) external view returns (uint256);

    function balanceOf(address _rewardToken, address _account) external view returns (uint256);

    // Mutative

    function stake(address[] calldata _rewardToken, address _account, uint256[] calldata _amount) external;

    function withdraw(address[] calldata _rewardToken, address _account, uint256[] calldata _amount) external;

    function getReward(address[] calldata _rewardToken, address _account) external;

    function exit(address[] calldata _rewardToken, address _account) external;
}