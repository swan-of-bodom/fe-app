import BN from "bn.js";
import { AMM_METHODS } from "../constants/amm";
import { getMainContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { isNonEmptyArray } from "../utils/utils";

export const getOptionsWithPositionOfUser = async (
  address: string
): Promise<BN[]> => {
  const contract = getMainContract();

  const res = await contract[AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER](
    address
  ).catch((e: Error) => {
    debug("Failed while calling", AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER);
    throw Error(e.message);
  });

  if (isNonEmptyArray(res) && isNonEmptyArray(res[0])) {
    return res[0];
  }
  return [];
};
