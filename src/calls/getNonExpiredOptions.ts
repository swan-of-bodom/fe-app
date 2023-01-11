import BN from "bn.js";
import { getTokenAddresses, AMM_METHODS } from "../constants/amm";
import { getMainContract } from "../utils/blockchain";
import { isNonEmptyArray } from "../utils/utils";
import { debug } from "../utils/debugger";

const methodName = AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA;

type Response = {
  array: BN[];
};

export const getNonExpiredOptions = async (): Promise<BN[]> => {
  const { LPTOKEN_CONTRACT_ADDRESS, LPTOKEN_CONTRACT_ADDRESS_PUT } =
    getTokenAddresses();

  const contract = getMainContract();

  const call = contract[methodName](LPTOKEN_CONTRACT_ADDRESS);

  const put = contract[methodName](LPTOKEN_CONTRACT_ADDRESS_PUT);

  const res = await Promise.allSettled([call, put]);

  debug(`${methodName} res`, res);

  try {
    const combined = res
      .filter(
        (promise): promise is PromiseFulfilledResult<Response> =>
          promise.status === "fulfilled"
      )
      .map((promise) => promise.value)
      .filter((v) => v && isNonEmptyArray(v?.array))
      .map((v) => v.array)
      .flat();

    return combined;
  } catch (error) {
    throw new Error(`Failed to deconstruct ${methodName} res`);
  }
};
