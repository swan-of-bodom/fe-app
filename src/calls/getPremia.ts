import {
  AMM_METHODS,
  ETH_USDC_CALL_ADDRESS,
  ETH_USDC_PUT_ADDRESS,
} from "../constants/amm";
import { getMainContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { convertSizeToUint256 } from "../utils/conversions";
import { isCall } from "../utils/utils";
import { Math64x61 } from "../types/units";
import { isBN } from "bn.js";
import { Option } from "../classes/Option";

const method = AMM_METHODS.GET_TOTAL_PREMIA;

export const getPremia = async (
  option: Option,
  size: number,
  isClosing: boolean
): Promise<Math64x61> => {
  const lpAddress = isCall(option.parsed.optionType)
    ? ETH_USDC_CALL_ADDRESS
    : ETH_USDC_PUT_ADDRESS;
  const convertedSize = convertSizeToUint256(size);
  const isClosingString = isClosing ? "0x1" : "0x0";

  const calldata = [option.struct, lpAddress, convertedSize, isClosingString];

  const contract = getMainContract();

  const res = await contract.call(method, calldata).catch((e: Error) => {
    debug(`Failed while calling ${method}`, e.message);
    throw Error(e.message);
  });

  if (!isBN(res?.total_premia_including_fees)) {
    throw Error("Response did not included total_premia_including_fees");
  }

  return res.total_premia_including_fees.toString(10);
};
