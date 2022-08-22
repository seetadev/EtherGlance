//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../libraries/Exponential.sol";

contract ExponentialMock is Exponential {
    function addExp_both(uint256 a, uint256 b) public pure returns (MathError, Exp memory) {
        return addExp(Exp({mantissa: a}), Exp({mantissa: b}));
    }

    function subExp_both(uint256 a, uint256 b) public pure returns (MathError, Exp memory) {
        return subExp(Exp({mantissa: a}), Exp({mantissa: b}));
    }

    function _divScalar(uint256 a, uint scalar) public pure returns (MathError, Exp memory) {
        return divScalar(Exp({mantissa: a}), scalar);
    }
    function mulExp_both(uint256 a, uint256 b) public pure returns (MathError, Exp memory) {
        return mulExp(Exp({mantissa: a}), Exp({mantissa: b}));
    }

    function mulExp_scalar(uint a, uint b) public pure returns (MathError, Exp memory) {
        return mulExp(a, b);
    }

    function _mulExp3(uint a, uint b, uint c) public pure returns (MathError, Exp memory) {
        return mulExp3(Exp({mantissa: a}), Exp({mantissa: b}), Exp({mantissa: c}));
    }

    function divExp_both(uint256 a, uint256 b) public pure returns (MathError, Exp memory) {
        return divExp(Exp({mantissa: a}), Exp({mantissa: b}));
    }
}