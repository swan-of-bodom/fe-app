import { AMM_METHODS } from "../constants/amm";
import { AMMContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { convertSizeToUint256 } from "../utils/conversions";
import { Option } from "../classes/Option";
import { BigNumberish } from "starknet";

const method = AMM_METHODS.GET_TOTAL_PREMIA;

export const getPremia = async (
  option: Option,
  size: number,
  isClosing: boolean
): Promise<bigint> => {
  const convertedSize = convertSizeToUint256(size);

  const calldata = [option.struct, convertedSize, isClosing];

  debug("GET_TOTAL_PREMIA", calldata);
  debug("STRINGIFIED", JSON.stringify(calldata));

  const res = await AMMContract.call(
    method,
    calldata,
    { parseResponse: false } // currently starknet-js cannot parse tuple, gotta format manually
  ).catch((e: Error) => {
    debug(`Failed while calling ${method}`, e.message);
    throw Error(e.message);
  });

  if (res && (res as string[]).length && (res as string[]).length === 4) {
    return BigInt((res as string[])[2]);
  }

  return BigInt(res as BigNumberish);
};
