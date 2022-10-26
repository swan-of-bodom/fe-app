import { Contract } from "starknet";
import { AMM_METHODS } from "../constants/amm";
import { RawOption } from "../types/options";
import { rawOptionToTokenAddressCalldata } from "../utils/parseOption";

export const getOptionTokenAddress = async (
  contract: Contract,
  raw: RawOption
): Promise<RawOption | null> => {
  const calldata = rawOptionToTokenAddressCalldata(raw);
  const res = await contract[AMM_METHODS.GET_OPTION_TOKEN_ADDRESS](...calldata);
  return { ...raw, token_address: res[0] };
};
