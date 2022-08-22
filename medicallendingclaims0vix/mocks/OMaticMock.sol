//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../otokens/OMatic.sol";

import "../interfaces/IComptroller.sol";
import "../interest-rate-models/interfaces/IInterestRateModel.sol";
import "../otokens/interfaces/IOToken.sol";


contract OMaticMock is OMatic {
    uint256 public blockTimestamp = 1647281432;
    uint256 public harnessExchangeRate;
    bool public harnessExchangeRateStored;

    mapping (address => bool) public failTransferToAddresses;

    function harnessSetAccrualBlockTimestamp(uint _accrualblockTimestamp) public {
        accrualBlockTimestamp = _accrualblockTimestamp;
    }

    function harnessSetBlockTimestamp(uint newBlockTimestamp) public {
        blockTimestamp = newBlockTimestamp;
    }

    function harnessFastForward(uint sec) public {
        blockTimestamp += sec;
    }

    function harnessAccountBorrows(address account) public view returns (uint principal, uint interestIndex) {
        BorrowSnapshot memory snapshot = accountBorrows[account];
        return (snapshot.principal, snapshot.interestIndex);
    }

    function harnessSetTotalBorrows(uint totalBorrows_) public {
        totalBorrows = totalBorrows_;
    }

    function harnessSetAccountBorrows(address account, uint principal, uint interestIndex) public {
        accountBorrows[account] = BorrowSnapshot({principal: principal, interestIndex: interestIndex});
    }

    function harnessSetBorrowIndex(uint borrowIndex_) public {
        borrowIndex = borrowIndex_;
    }
}