import { Option } from "../types/options";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { rawOptionToStruct } from "../utils/parseOption";
import { getMainContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { convertSizeToUint256 } from "../utils/conversions";
import { isCall } from "../utils/utils";
import { Math64x61 } from "../types/units";
import { isBN } from "bn.js";

const method = AMM_METHODS.GET_TOTAL_PREMIA;

export const getPremia = async (
  option: Option,
  size: number,
  isClosing: boolean
): Promise<Math64x61> => {
  const addresses = getTokenAddresses();
  const lpAddress = isCall(option.parsed.optionType)
    ? addresses.LPTOKEN_CONTRACT_ADDRESS
    : addresses.LPTOKEN_CONTRACT_ADDRESS_PUT;
  const convertedSize = convertSizeToUint256(size);
  const isClosingString = isClosing ? "0x1" : "0x0";
  const optionStruct = rawOptionToStruct(option.raw);

  const calldata = [
    Object.values(optionStruct),
    lpAddress,
    convertedSize,
    isClosingString,
  ];

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
