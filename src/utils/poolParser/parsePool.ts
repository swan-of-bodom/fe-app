import { ETH_DIGITS } from "../../constants/amm";
import {
  Pool,
  PoolInfo,
  RawPool,
  RawPoolInfo,
  RawUserPoolInfo,
  UserPoolInfo,
} from "../../types/pool";
import { bnToOptionType } from "../conversions";
import { intToDecimal, uint256toDecimal } from "../units";
import { digitsByType, toHex } from "../utils";
import { uint256ToBN } from "starknet/dist/utils/uint256";

export const parsePool = (raw: RawPool): Pool => {
  const parsed = {
    quoteTokenAddress: toHex(raw.quote_token_address),
    baseTokenAddress: toHex(raw.base_token_address),
    optionType: bnToOptionType(raw.option_type),
  };
  return { raw, parsed };
};

export const parsePoolInfo = (raw: RawPoolInfo): PoolInfo => {
  const pool = parsePool(raw.pool);
  const parsed = {
    pool,
    lptokenAddress: toHex(raw.lptoken_address),
    stakedCapital: uint256ToBN(raw.staked_capital).toString(10),
    unlockedCapital: uint256ToBN(raw.unlocked_capital).toString(10),
    valueOfPoolPosition: raw.value_of_pool_position.toString(10),
  };
  return { raw, parsed };
};

export const parseUserPoolInfo = (raw: RawUserPoolInfo): UserPoolInfo => {
  const poolInfo = parsePoolInfo(raw.pool_info);
  const valueBN = uint256ToBN(raw.value_of_user_stake);
  const sizeBN = uint256ToBN(raw.size_of_users_tokens);
  const sizeOfUsersTokensDecimal = uint256toDecimal(sizeBN, ETH_DIGITS);
  const valueOfUserStakeBase = valueBN.toString(10);
  const valueOfUserStakeDecimal = intToDecimal(
    valueOfUserStakeBase,
    digitsByType(poolInfo.parsed.pool.parsed.optionType)
  );
  const parsed = {
    poolInfo,
    valueOfUserStakeBase,
    valueOfUserStakeDecimal,
    sizeOfUsersTokensBase: sizeBN.toString(10),
    sizeOfUsersTokensDecimal,
  };
  return { raw, parsed };
};
