import BN from "bn.js";
import config from "./config.json";

export const NETWORK = config.NETWORK;
export const API_URL = config.API_URL;
export const AMM_ADDRESS = config.AMM_ADDRESS;
export const GOVERNANCE_ADDRESS = config.GOVERNANCE_ADDRESS;
export const ETH_ADDRESS = config.ETH_ADDRESS;
export const USDC_ADDRESS = config.USDC_ADDRESS;
export const BTC_ADDRESS = config.BTC_ADDRESS;
export const ETH_USDC_CALL_ADDRESS = config.ETH_USDC_CALL_ADDRESS;
export const ETH_USDC_PUT_ADDRESS = config.ETH_USDC_PUT_ADDRESS;
export const BTC_USDC_CALL_ADDRESS = config.BTC_USDC_CALL_ADDRESS;
export const BTC_USDC_PUT_ADDRESS = config.BTC_USDC_PUT_ADDRESS;

export const enum AMM_METHODS {
  IS_OPTION_AVAILABLE = "is_option_available",
  GET_POOL_AVAILABLE_BALANCE = "get_pool_available_balance",
  APPROVE = "approve",
  TRADE_OPEN = "trade_open",
  TRADE_CLOSE = "trade_close",
  TRADE_SETTLE = "trade_settle",
  GET_AVAILABLE_OPTIONS = "get_available_options",
  GET_OPTION_TOKEN_ADDRESS = "get_option_token_address",
  GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA = "get_all_non_expired_options_with_premia",
  GET_OPTION_WITH_POSITION_OF_USER = "get_option_with_position_of_user",
  DEPOSIT_LIQUIDITY = "deposit_liquidity",
  GET_USER_POOL_INFOS = "get_user_pool_infos",
  WITHDRAW_LIQUIDITY = "withdraw_liquidity",
  GET_TOTAL_PREMIA = "get_total_premia",
  GET_MAX_LPOOL_BALANCE = "get_max_lpool_balance",
  GET_LOOP_BALANCE = "get_lpool_balance",
  GET_UNDERLYING_FOR_LPTOKENS = "get_underlying_for_lptokens",
  GET_UNLOCKED_CAPITAL = "get_unlocked_capital",
}

export const coreTeamAddresses = [
  "0x583a9d956d65628f806386ab5b12dccd74236a3c6b930ded9cf3c54efc722a1",
  "0x6717eaf502baac2b6b2c6ee3ac39b34a52e726a73905ed586e757158270a0af",
  "0x11d341c6e841426448ff39aa443a6dbb428914e05ba2259463c18308b86233",
  "0x3d1525605db970fa1724693404f5f64cba8af82ec4aab514e6ebd3dec4838ad",
  "0x3c032b19003bdd6f4155a30fffa0bda3a9cae45feb994a721299d7e5096568c",
  // my Testnet wallet
  "0x29af9cf62c9d871453f3b033e514dc790ce578e0e07241d6a5fedf19ceeaf08",
];

export const SLIPPAGE = 0.1;

export const BASE_DIGITS = 18;
export const ETH_DIGITS = 18;
export const USDC_DIGITS = 6;
export const ETH_BASE_VALUE = new BN(10).pow(new BN(ETH_DIGITS));
export const USDC_BASE_VALUE = new BN(10).pow(new BN(USDC_DIGITS));
export const BASE_MATH_64_61 = new BN(2).pow(new BN(61));
export const USDC_PRECISSION = 1000;
