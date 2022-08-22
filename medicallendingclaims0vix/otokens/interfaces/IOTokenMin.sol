//SPDX-License-Identifier: MIT
pragma solidity =0.8.4;

interface IOTokenMin {
    function balanceOf(address user) external view returns(uint256);
    function borrowBalanceStored(address user) external view returns(uint256);
    function totalSupply() external view returns(uint256);
    function totalBorrows() external view returns(uint256);
}