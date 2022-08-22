//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

interface IDragonLair {
    function enter(uint256 _quickAmount) external;
    function leave(uint256 _dQuickAmount) external;
    //returns how much dQUICK someone gets for depositing QUICK
    function QUICKForDQUICK(uint256 _quickAmount) external view returns (uint256 dQuickAmount_);

    //returns how much QUICK someone gets for returning dQUICK
    function dQUICKForQUICK(uint256 _dQuickAmount) external view returns (uint256 quickAmount_);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);
}