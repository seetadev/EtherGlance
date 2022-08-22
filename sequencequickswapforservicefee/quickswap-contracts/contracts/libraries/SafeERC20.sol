//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {IERC20} from "../interfaces/IERC20.sol";

// Some of the code is taken and modified from OpenZeppelin's contracts: https://github.com/OpenZeppelin/openzeppelin-contracts/

// helper methods for interacting with ERC20 tokens that do not consistently return true/false
library SafeERC20 {
    
    function isContract(address _account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        assembly {
            size := extcodesize(_account)
        }
        return size > 0;
    }

    function safeTransfer(address _token, address _to, uint _value) internal {
        require(isContract(_token), "Address: call to non-contract");        
        (bool success, bytes memory returndata) = _token.call(abi.encodeWithSelector(IERC20.transfer.selector, _to, _value));
        verifyCallResult(success, returndata, "ERC20 transfer failed");
    }

    function safeTransferFrom(address _token, address _from, address _to, uint _value) internal {
        require(isContract(_token), "Address: call to non-contract");        
        (bool success, bytes memory returndata) = _token.call(abi.encodeWithSelector(IERC20.transferFrom.selector, _from, _to, _value));
        verifyCallResult(success, returndata, "ERC20 transferFrom failed");        
    }   

    function verifyCallResult(
        bool _success,
        bytes memory _returndata,
        string memory _errorMessage
    ) internal pure {
        if (_success) {
             if (_returndata.length > 0) {
                // Return data is optional
                require(abi.decode(_returndata, (bool)), _errorMessage);
             }
        } else {
            // Look for revert reason and bubble it up if present
            if (_returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                assembly {
                    let returndata_size := mload(_returndata)
                    revert(add(32, _returndata), returndata_size)
                }
            } else {
                revert(_errorMessage);
            }
        }
    }
}