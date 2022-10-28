import { Contract } from "starknet";
import { AMM_METHODS } from "../constants/amm";
import { RawOption } from "../types/options";
import { rawOptionToTokenAddressCalldata } from "../utils/parseOption";
import { isNonEmptyArray } from "../utils/utils";

export const getOptionTokenAddress = async (
  contract: Contract,
  raw: RawOption
): Promise<RawOption | undefined> => {
  const calldata = rawOptionToTokenAddressCalldata(raw);
  const res = await contract[AMM_METHODS.GET_OPTION_TOKEN_ADDRESS](...calldata);

  if (isNonEmptyArray(res)) {
    return { ...raw, token_address: res[0] };
  }

  return undefined;
};
