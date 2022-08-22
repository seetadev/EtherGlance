//SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

// I found that SafeMath function calls are easier to read than without them when a long series of math operations are used.

library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;        
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction underflow");
        unchecked {
            return a - b;
        }        
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;        
    }
    
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}