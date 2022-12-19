import { CompositeOption, OptionSide, OptionType } from "../types/options";
import { longInteger, shortInteger } from "../utils/computations";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
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
  if (type === OptionType.Call) {
    const convertedSize = "0x" + longInteger(size, 18).toString(16);
    return { convertedSize, lpAddress: addresses.LPTOKEN_CONTRACT_ADDRESS };
  }
  const convertedSize = "0x" + longInteger(size, 6).toString(16);
  return { convertedSize, lpAddress: addresses.LPTOKEN_CONTRACT_ADDRESS_PUT };
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

  debug("Getting total premia with calldata:", calldata);

  const res = await contract[AMM_METHODS.GET_TOTAL_PREMIA](...calldata);

  debug("Got total premia:", res);

  if (res?.total_premia_including_fees) {
    const digits = option.parsed.optionType === OptionType.Call ? 18 : 6;
    const str = new BN(res.total_premia_including_fees).toString(10);
    return shortInteger(str, digits);
  }

  return res;
};
