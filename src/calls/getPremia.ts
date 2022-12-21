import { CompositeOption, OptionType } from "../types/options";
import {
  AMM_METHODS,
  BASE_MATH_64_61,
  getTokenAddresses,
} from "../constants/amm";
import { rawOptionToStruct } from "../utils/parseOption";
import { getMainContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { BN } from "bn.js";

type ConvertedData = {
  lpAddress: string;
  convertedSize: string;
};

const convertData = (type: OptionType, size: number): ConvertedData => {
  const addresses = getTokenAddresses();
  const lpAddress =
    type === OptionType.Call
      ? addresses.LPTOKEN_CONTRACT_ADDRESS
      : addresses.LPTOKEN_CONTRACT_ADDRESS_PUT;

  const precission = 1000000;
  const convertedSize = new BN(size * precission)
    .mul(BASE_MATH_64_61)
    .div(new BN(precission))
    .toString(10);
  return { convertedSize, lpAddress };
};

export const getPremia = async (
  option: CompositeOption,
  size: number,
  isClosing: boolean
) => {
  const { convertedSize, lpAddress } = convertData(
    option.parsed.optionType,
    size
  );
  const isClosingString = +isClosing + "";
  const optionStruct = rawOptionToStruct(option.raw);
  const calldata = [optionStruct, lpAddress, convertedSize, isClosingString];

  const contract = getMainContract();

  debug("Getting total premia with calldata:", {
    calldata,
    flat: JSON.stringify(calldata.flat()),
  });

  const res = await contract[AMM_METHODS.GET_TOTAL_PREMIA](...calldata);

  debug("Got total premia:", res);

  if (res?.total_premia_including_fees) {
    const precission = 100000;
    return (
      new BN(res.total_premia_including_fees)
        .mul(new BN(precission))
        .div(BASE_MATH_64_61)
        .toNumber() / precission
    );
  }

  return res;
};
