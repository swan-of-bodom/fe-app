import BN from "bn.js";
import { AMM_METHODS } from "../constants/amm";
import { debug } from "../utils/debugger";
import { isNonEmptyArray } from "../utils/utils";
import { AMMContract } from "../utils/blockchain";

const method = AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER;

export const getOptionsWithPositionOfUser = async (
  address: string
): Promise<BN[]> => {
  const res = await AMMContract.call(method, [address]).catch((e: Error) => {
    debug("Failed while calling", method);
    throw Error(e.message);
  });

  if (isNonEmptyArray(res) && isNonEmptyArray(res[0])) {
    return res[0];
  }
  return [];
};
