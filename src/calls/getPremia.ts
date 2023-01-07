import { CompositeOption } from "../types/options";
import {
  AMM_METHODS,
  BASE_MATH_64_61,
  getTokenAddresses,
} from "../constants/amm";
import { rawOptionToStruct } from "../utils/parseOption";
import { getMainContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { BN } from "bn.js";
import { convertSizeToUint256 } from "../utils/conversions";
import { isCall } from "../utils/utils";

export const getPremia = async (
  option: CompositeOption,
  size: number,
  isClosing: boolean
): Promise<number> => {
  const addresses = getTokenAddresses();
  const lpAddress = isCall(option.parsed.optionType)
    ? addresses.LPTOKEN_CONTRACT_ADDRESS
    : addresses.LPTOKEN_CONTRACT_ADDRESS_PUT;
  const convertedSize = convertSizeToUint256(size, option.parsed.optionType);
  const isClosingString = isClosing ? "0x1" : "0x0";
  const optionStruct = rawOptionToStruct(option.raw);
  const calldata = [optionStruct, lpAddress, convertedSize, isClosingString];

  const contract = getMainContract();

  debug("Getting total premia with calldata:", {
    calldata,
    flat: JSON.stringify(calldata.flat()),
  });

  const res = await contract[AMM_METHODS.GET_TOTAL_PREMIA](...calldata).catch(
    (e: Error) => {
      debug("Failed to get total premia", e.message);
      throw Error(e.message);
    }
  );

  debug("Got total premia:", res);

  if (!res?.total_premia_including_fees) {
    throw Error("Response did not included total_premia_including_fees");
  }

  const precission = 100000;
  return (
    new BN(res.total_premia_including_fees)
      .mul(new BN(precission))
      .div(BASE_MATH_64_61)
      .toNumber() / precission
  );
};
