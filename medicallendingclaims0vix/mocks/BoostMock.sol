//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract BoostMock {
  function updateBoostSupplyBalances(address market, address user, uint256 oldBalance, uint256 newBalance) external {
    market; user; oldBalance; newBalance;
  }
  function updateBoostBorrowBalances(address market, address user, uint256 oldBalance, uint256 newBalance) external {
    market; user; oldBalance; newBalance;
  }
}