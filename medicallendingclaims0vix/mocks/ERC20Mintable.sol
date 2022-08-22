//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Mintable is ERC20, Ownable {
    uint8 private dec = 0;
    // To support testing, we can specify addresses for which transferFrom should fail and return false
    mapping (address => bool) public failTransferFromAddresses;

    // To support testing, we allow the contract to always fail `transfer`.
    mapping (address => bool) public failTransferToAddresses;

    constructor(string memory _name, string memory _symbol, uint8 _dec) ERC20(_name, _symbol) {
        dec = _dec;
        _mint(owner(), 10000000 * (10**decimals()));
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function harnessSetFailTransferFromAddress(address src, bool _fail) public {
        failTransferFromAddresses[src] = _fail;
    }

    function harnessSetFailTransferToAddress(address dst, bool _fail) public {
        failTransferToAddresses[dst] = _fail;
    }

    function harnessSetBalance(address who, uint256 amount) public {
        uint256 oldBalance = balanceOf(who);

        if (oldBalance > amount) {
            _burn(who, oldBalance - amount);
        } else {
            _mint(who, amount - oldBalance);
        }
    }

    function transfer(address dst, uint256 amount) public override returns (bool success) {
        // Added for testing purposes
        if (failTransferToAddresses[dst]) {
            return false;
        }
        return super.transfer(dst, amount);
    }

    function transferFrom(address src, address dst, uint256 amount) public override returns (bool success) {
        // Added for testing purposes
        if (failTransferFromAddresses[src]) {
            return false;
        }
        return super.transferFrom(src, dst, amount);
    }

    function decimals() public view override returns (uint8) {
        return dec;
    }

    
}