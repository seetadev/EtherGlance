//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./otokens/OMatic.sol";

/**
 * @title 0VIX's Maximillion Contract
 * @author 0VIX
 */
contract Maximillion {
    /**
     * @notice The default oMatic market to repay in
     */
    OMatic public oMatic;

    /**
     * @notice Construct a Maximillion to repay max in a OMatic market
     */
    constructor(OMatic oMatic_) {
        oMatic = oMatic_;
    }

    /**
     * @notice msg.sender sends Matic to repay an account's borrow in the oMatic market
     * @dev The provided Matic is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     */
    function repayBehalf(address borrower) public payable {
        repayBehalfExplicit(borrower, oMatic);
    }

    /**
     * @notice msg.sender sends Matic to repay an account's borrow in a oMatic market
     * @dev The provided Matic is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     * @param oMatic_ The address of the oMatic contract to repay in
     */
    function repayBehalfExplicit(address borrower, OMatic oMatic_) public payable {
        uint received = msg.value;
        uint borrows = oMatic_.borrowBalanceCurrent(borrower);
        if (received > borrows) {
            oMatic_.repayBorrowBehalf{value: borrows}(borrower);
            payable(msg.sender).transfer(received - borrows);
        } else {
            oMatic_.repayBorrowBehalf{value: received}(borrower);
        }
    }
}
