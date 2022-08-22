//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/**
 * @title Exponential module for storing fixed-precision decimals
 * @author 0VIX
 * @notice Exp is a struct which stores decimals with a fixed precision of 18 decimal places.
 *         Thus, if we wanted to store the 5.1, mantissa would store 5.1e18. That is:
 *         `Exp({mantissa: 5100000000000000000})`.
 */
contract ExponentialNoError {
    uint constant expScale = 1e18;
    uint constant doubleScale = 1e36;
    uint constant halfExpScale = expScale/2;
    uint constant mantissaOne = expScale;

    struct Exp {
        uint mantissa;
    }

    struct Double {
        uint mantissa;
    }

    /**
     * @dev Truncates the given exp to a whole number value.
     *      For example, truncate(Exp{mantissa: 15 * expScale}) = 15
     */
    function truncate(Exp memory exp) pure internal returns (uint) {
        // Note: We are not using careful math here as we're performing a division that cannot fail
        return exp.mantissa / expScale;
    }

    /**
     * @dev Multiply an Exp by a scalar, then truncate to return an unsigned integer.
     */
    function mul_ScalarTruncate(Exp memory a, uint scalar) pure internal returns (uint) {
        return truncate(mul_(a, scalar));
    }

    /**
     * @dev Multiply an Exp by a scalar, truncate, then add an to an unsigned integer, returning an unsigned integer.
     */
    function mul_ScalarTruncateAddUInt(Exp memory a, uint scalar, uint addend) pure internal returns (uint) {
        return truncate(mul_(a, scalar)) + addend;
    }

    /**
     * @dev Checks if first Exp is less than second Exp.
     */
    function lessThanExp(Exp memory left, Exp memory right) pure internal returns (bool) {
        return left.mantissa < right.mantissa;
    }

    /**
     * @dev Checks if left Exp <= right Exp.
     */
    function lessThanOrEqualExp(Exp memory left, Exp memory right) pure internal returns (bool) {
        return left.mantissa <= right.mantissa;
    }

    /**
     * @dev Checks if left Exp > right Exp.
     */
    function greaterThanExp(Exp memory left, Exp memory right) pure internal returns (bool) {
        return left.mantissa > right.mantissa;
    }

    /**
     * @dev returns true if Exp is exactly zero
     */
    function isZeroExp(Exp memory value) pure internal returns (bool) {
        return value.mantissa == 0;
    }

    function safe224(uint n) pure internal returns (uint224) {
        require(n < 2**224, "safe224 overflow");
        return uint224(n);
    }

    function safe32(uint n) pure internal returns (uint32) {
        require(n < 2**32, "safe32 overflow");
        return uint32(n);
    }

    function add_(Exp memory a, Exp memory b) pure internal returns (Exp memory) {
        return Exp({mantissa: a.mantissa + b.mantissa});
    }

    function add_(Double memory a, Double memory b) pure internal returns (Double memory) {
        return Double({mantissa: a.mantissa + b.mantissa});
    }

    function add_(uint a, uint b, string memory errorMessage) pure internal returns (uint c) {
        unchecked {
            require((c = a + b ) >= a, errorMessage);
        }
    }

    function sub_(Exp memory a, Exp memory b) pure internal returns (Exp memory) {
        return Exp({mantissa: a.mantissa - b.mantissa});
    }

    function sub_(Double memory a, Double memory b) pure internal returns (Double memory) {
        return Double({mantissa: a.mantissa - b.mantissa});
    }

    function sub_(uint a, uint b, string memory errorMessage) pure internal returns (uint c) {
        unchecked {
            require((c = a - b) <= a, errorMessage);
        }
    }

    function mul_(Exp memory a, Exp memory b) pure internal returns (Exp memory) {
        return Exp({mantissa: (a.mantissa * b.mantissa) / expScale});
    }

    function mul_(Exp memory a, uint b) pure internal returns (Exp memory) {
        return Exp({mantissa: a.mantissa * b});
    }

    function mul_(uint a, Exp memory b) pure internal returns (uint) {
        return (a * b.mantissa) / expScale;
    }

    function mul_(Double memory a, Double memory b) pure internal returns (Double memory) {
        return Double({mantissa: (a.mantissa * b.mantissa) / doubleScale});
    }

    function mul_(Double memory a, uint b) pure internal returns (Double memory) {
        return Double({mantissa: a.mantissa * b});
    }

    function mul_(uint a, Double memory b) pure internal returns (uint) {
        return (a * b.mantissa) / doubleScale;
    }

    function mul_(uint a, uint b, string memory errorMessage) pure internal returns (uint c) {
        unchecked {
            require(a == 0 || (c = a * b) / a == b, errorMessage);
        }
    }

    function div_(Exp memory a, Exp memory b) pure internal returns (Exp memory) {
        return Exp({mantissa: (a.mantissa * expScale) / b.mantissa});
    }

    function div_(Exp memory a, uint b) pure internal returns (Exp memory) {
        return Exp({mantissa: a.mantissa / b});
    }

    function div_(uint a, Exp memory b) pure internal returns (uint) {
        return (a * expScale) / b.mantissa;
    }

    function div_(Double memory a, Double memory b) pure internal returns (Double memory) {
        return Double({mantissa: (a.mantissa * doubleScale) / b.mantissa});
    }

    function div_(Double memory a, uint b) pure internal returns (Double memory) {
        return Double({mantissa: a.mantissa / b});
    }

    function div_(uint a, Double memory b) pure internal returns (uint) {
        return (a * doubleScale) / b.mantissa;
    }

    function div_(uint a, uint b, string memory errorMessage) pure internal returns (uint) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    function fraction(uint a, uint b) pure internal returns (Double memory) {
        return Double({mantissa: (a * doubleScale) / b});
    }
}
