//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/IOErc20.sol";


abstract contract OErc20Storage is IOErc20 {
    /**
     * @notice Underlying asset for this OToken
     */
    address public override underlying;
}
