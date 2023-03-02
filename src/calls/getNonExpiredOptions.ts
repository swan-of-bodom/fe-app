import BN from "bn.js";
import { getTokenAddresses, AMM_METHODS } from "../constants/amm";
import { getMainContract } from "../utils/blockchain";
import { isNonEmptyArray } from "../utils/utils";
import { debug } from "../utils/debugger";
import { Result } from "starknet";

const method = AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA;

export const getNonExpiredOptions = async (): Promise<BN[]> => {
  const { LPTOKEN_CONTRACT_ADDRESS, LPTOKEN_CONTRACT_ADDRESS_PUT } =
    getTokenAddresses();

  const contract = getMainContract();

  const call = contract.call(method, [LPTOKEN_CONTRACT_ADDRESS]);

  const put = contract.call(method, [LPTOKEN_CONTRACT_ADDRESS_PUT]);

  const res = await Promise.allSettled([call, put]);

  debug(`${method} res`, res);

  try {
    const combined = res
      .filter(
        (promise): promise is PromiseFulfilledResult<Result> =>
          promise.status === "fulfilled"
      )
      .map((promise) => promise.value)
      .filter((v) => v && isNonEmptyArray(v?.array))
      .map((v) => v.array)
      .flat();

    return combined;
  } catch (error) {
    throw new Error(`Failed to deconstruct ${method} res`);
  }
};
