import { Pool } from "../../classes/Pool";
import { ETH_DIGITS } from "../../constants/amm";
import {
  PoolInfo,
  RawPool,
  ResponsePoolInfo,
  ResponseUserPoolInfo,
  UserPoolInfo,
} from "../../types/pool";
import { intToDecimal, uint256toDecimal } from "../units";
import { digitsByType, toHex } from "../utils";
import { uint256 } from "starknet";

export const parsePool = (raw: RawPool): Pool => new Pool({ raw });

export const parsePoolInfo = (response: ResponsePoolInfo): PoolInfo => {
  const pool = parsePool(response.pool);
  const parsed = {
    lptokenAddress: toHex(response.lptoken_address),
    stakedCapital: uint256.uint256ToBN(response.staked_capital).toString(10),
    unlockedCapital: uint256
      .uint256ToBN(response.unlocked_capital)
      .toString(10),
    valueOfPoolPosition: response.value_of_pool_position.toString(10),
    ...pool.parsed,
  };
  const {
    lptoken_address,
    staked_capital,
    unlocked_capital,
    value_of_pool_position,
  } = response;
  const raw = {
    lptoken_address,
    staked_capital,
    unlocked_capital,
    value_of_pool_position,
    ...pool.raw,
  };
  return { raw, parsed };
};

export const parseUserPoolInfo = (
  response: ResponseUserPoolInfo
): UserPoolInfo => {
  const poolInfo = parsePoolInfo(response.pool_info);
  const valueBN = uint256.uint256ToBN(response.value_of_user_stake);
  const sizeBN = uint256.uint256ToBN(response.size_of_users_tokens);
  const sizeOfUsersTokensDecimal = uint256toDecimal(sizeBN, ETH_DIGITS);
  const valueOfUserStakeBase = valueBN.toString(10);
  const valueOfUserStakeDecimal = intToDecimal(
    valueOfUserStakeBase,
    digitsByType(poolInfo.parsed.optionType)
  );
  const parsed = {
    valueOfUserStakeBase,
    valueOfUserStakeDecimal,
    sizeOfUsersTokensBase: sizeBN.toString(10),
    sizeOfUsersTokensDecimal,
    ...poolInfo.parsed,
  };

  const { value_of_user_stake, size_of_users_tokens } = response;

  const raw = {
    value_of_user_stake,
    size_of_users_tokens,
    ...poolInfo.raw,
  };

  return { raw, parsed };
};
