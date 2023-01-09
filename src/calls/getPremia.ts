import { CompositeOption } from "../types/options";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { rawOptionToStruct } from "../utils/parseOption";
import { getMainContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { convertSizeToUint256 } from "../utils/conversions";
import { isCall } from "../utils/utils";
import { math64x61toDecimal } from "../utils/units";

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

  const res = await contract[AMM_METHODS.GET_TOTAL_PREMIA](...calldata).catch(
    (e: Error) => {
      debug("Failed to get total premia", e.message);
      throw Error(e.message);
    }
  );

  if (!res?.total_premia_including_fees) {
    throw Error("Response did not included total_premia_including_fees");
  }

  const convertedPremiaWithFees = math64x61toDecimal(
    res.total_premia_including_fees
  );

  debug("Converted premia:", convertedPremiaWithFees);

  return convertedPremiaWithFees;
};
