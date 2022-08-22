// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.4;
interface IGaugeController {
  function add_gauge(address newMarket, uint256 marketType, uint256 weight) external;
  function remove_gauge(address market) external;
  function gauge_relative_weight(address market, uint256 timestamp) external view returns(uint256); //todo: remove block.timestamp in gaugescontroller or add new function
  function gauge_total_relative_weights(uint256 timestamp) external view returns(uint256); // todo: add in gaugescontroller
  function get_total_weight() external view returns(uint256);
  function get_last_date() external view returns(uint256); // todo: add in gaugescontroller
}
