//SPDX-License-Identifier: Unlicense

pragma solidity =0.8.4;
interface IVotingEscrow {
    function get_last_user_slope(address addr) external view returns(int128);

    function locked__end(address addr) external view returns(uint256);
}