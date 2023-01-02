import BN from "bn.js";
import {
  AMM_METHODS,
  ETH_BASE_VALUE,
  USD_BASE_VALUE,
} from "../../constants/amm";
import { OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import { isNonEmptyArray } from "../../utils/utils";

import { getMainContract } from "../../utils/blockchain";
import { uint256ToBN } from "starknet/dist/utils/uint256";
import { QueryFunctionContext } from "react-query";

/*

struct Pool {
    quote_token_address: Address,
    base_token_address: Address,
    option_type: OptionType,
}

// PoolInfo containes Pool plus some additional information
//      - lptoken_address
//      - staked capital (lpool_balance)
//      - unlocked capital
//      - value of given pool
struct PoolInfo {
    quote_token_address: Address,
    base_token_address: Address,
    option_type: OptionType,
    lptoken_address: Address,
    staked_capital: Math64x61_,  // lpool_balance
    unlocked_capital: Math64x61_,
    value_of_pool_position: Math64x61_,
}

struct UserPoolInfo {
    value_of_user_stake: Uint256,
    size_of_users_tokens: Uint256,
    pool_info: PoolInfo,
}

*/

const precision = 1000000;

export type StakedCapitalInfo = {
  value: number;
  numberOfTokens: number;
  type: OptionType;
  poolInfo: Object;
};

const parseUserPool = (arr: any[]): StakedCapitalInfo[] | null => {
  debug("Received data", arr, arr.length);

  if (!isNonEmptyArray(arr)) {
    debug("Empty array, nothing to parse");
    return null;
  }

  const res = arr.map(
    ({ pool_info, value_of_user_stake, size_of_users_tokens }) => {
      debug("Mapping over pools", {
        pool_info,
        value_of_user_stake,
        size_of_users_tokens,
      });

      const type = new BN(pool_info?.pool?.option_type).toString(
        10
      ) as OptionType;

      const baseValue =
        type === OptionType.Call ? ETH_BASE_VALUE : USD_BASE_VALUE;

      const value =
        new BN(uint256ToBN(value_of_user_stake))
          .mul(new BN(precision))
          .div(baseValue)
          .toNumber() / precision;

      const numberOfTokens =
        new BN(uint256ToBN(size_of_users_tokens))
          .mul(new BN(precision))
          .div(baseValue)
          .toNumber() / precision;

      debug("Parsed into", { value, numberOfTokens, type });
      return { value, numberOfTokens, type, poolInfo: pool_info };
    }
  );

  return res;
};

export const fetchCapital = async ({
  queryKey,
}: QueryFunctionContext<[string, string | undefined]>): Promise<
  StakedCapitalInfo[] | undefined
> => {
  const address = queryKey[1];

  const contract = getMainContract();
  const res = await contract[AMM_METHODS.GET_USER_POOL_INFOS](address).catch(
    (e: string) => {
      throw Error("Failed while calling");
    }
  );

  if (!isNonEmptyArray(res) || !isNonEmptyArray(res[0])) {
    debug("Got empty response while fetching capital");
    return;
  }

  const parsed = parseUserPool(res[0]);

  if (!parsed) {
    debug("Got null after parsing");
    return;
  }
  debug("Final data from pool", parsed);
  return parsed;
};
