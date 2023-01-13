import { RawPool, RawPoolInfo, RawUserPoolInfo } from "../../types/pool";
import { debug } from "../debugger";

export const isInstanceOfPool = (input: unknown): input is RawPool => {
  debug("isInstanceOfPool", input);
  if (!input) {
    return false;
  }

  const { quote_token_address, base_token_address, option_type } =
    input as RawPool;

  if (!quote_token_address || !base_token_address || !option_type) {
    return false;
  }

  debug("isInstanceOfPool - validated");

  return true;
};

export const isInstanceOfPoolInfo = (input: unknown): input is RawPoolInfo => {
  debug("isInstanceOfPoolInfo", input);

  if (!input) {
    return false;
  }

  const {
    pool,
    lptoken_address,
    staked_capital,
    unlocked_capital,
    value_of_pool_position,
  } = input as RawPoolInfo;

  if (!isInstanceOfPool(pool)) {
    return false;
  }

  if (
    !lptoken_address ||
    !value_of_pool_position ||
    !staked_capital ||
    !unlocked_capital
  ) {
    return false;
  }
  debug("isInstanceOfPoolInfo - validated");

  return true;
};

export const isInstanceOfUserPoolInfo = (
  input: unknown
): input is RawUserPoolInfo => {
  debug("isInstanceOfUserPoolInfo", input);

  if (!input) {
    return false;
  }

  const { pool_info, value_of_user_stake, size_of_users_tokens } =
    input as RawUserPoolInfo;

  debug("pool_info", pool_info);
  if (!isInstanceOfPoolInfo(pool_info)) {
    return false;
  }

  if (!value_of_user_stake || !size_of_users_tokens) {
    return false;
  }
  debug("isInstanceOfUserPoolInfo - validated");

  return true;
};
