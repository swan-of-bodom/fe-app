import BN from "bn.js";
import { AMM_METHODS, ETH_BASE_VALUE } from "../../constants/amm";
import { OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import { isNonEmptyArray } from "../../utils/utils";

import { getMainContract } from "../../utils/blockchain";

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

const precision = 10000;

type StakedCapitalInfo = {
  stakedCapital: number;
  numberOfTokens: number;
  type: OptionType;
  poolInfo: Object;
};

const parseUserPool = (
  arr: any[],
  address: string
): Promise<StakedCapitalInfo>[] | null => {
  debug("Received data", arr, arr.length);

  if (!isNonEmptyArray(arr)) {
    debug("Empty array, nothing to parse");
    return null;
  }

  const res = arr.map(
    async ({ pool_info, value_of_user_stake, size_of_users_tokens }) => {
      debug("Mapping over pools", {
        pool_info,
        value_of_user_stake,
        size_of_users_tokens,
      });

      const stakedCapital =
        new BN(value_of_user_stake.low)
          .mul(new BN(precision))
          .div(ETH_BASE_VALUE)
          .toNumber() / precision;

      const type = new BN(pool_info?.pool?.option_type).toString(
        10
      ) as OptionType;
      const numberOfTokens =
        new BN(size_of_users_tokens.low)
          .mul(new BN(precision))
          .div(ETH_BASE_VALUE)
          .toNumber() / precision;

      return { stakedCapital, numberOfTokens, type, poolInfo: pool_info };
    }
  );

  return res;
};

export const fetchCapital = async (
  address: string,
  setData: (v: any) => void,
  setLoading: (v: boolean) => void
) => {
  setLoading(true);
  const contract = getMainContract();
  const res = await contract[AMM_METHODS.GET_USER_POOL_INFOS](address).catch(
    (e: string) => {
      debug("Failed while calling", AMM_METHODS.GET_USER_POOL_INFOS);
      debug("error", e);
      setLoading(false);
      return;
    }
  );

  debug(AMM_METHODS.GET_USER_POOL_INFOS, "call returned", res);

  if (!isNonEmptyArray(res) || !isNonEmptyArray(res[0])) {
    debug("Got empty response while fetching capital");
    setLoading(false);
    return;
  }

  const promises = parseUserPool(res[0], address);

  if (!promises) {
    debug("Got null after parsing");
    setLoading(false);
    return;
  }

  const finalData = await Promise.all(promises).catch((e) => {
    debug("Parse user pool failed", e);
    return;
  });

  debug("Final data from pool", finalData);
  setData(finalData);
  setLoading(false);
};
