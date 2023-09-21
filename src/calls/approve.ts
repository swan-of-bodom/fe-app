import {
  AMM_ADDRESS,
  AMM_METHODS,
  ETH_ADDRESS,
  USDC_ADDRESS,
} from "../constants/amm";
import { AccountInterface } from "starknet";
import { number } from "starknet";
import LpAbi from "../abi/lptoken_abi.json";
import { debug, LogTypes } from "../utils/debugger";
import { OptionType } from "../types/options";
import BN from "bn.js";
import { isCall } from "../utils/utils";

export const approve = async (
  type: OptionType,
  account: AccountInterface,
  amount: string
) => {
  const contractAddress = isCall(type) ? ETH_ADDRESS : USDC_ADDRESS;
  try {
    const call = {
      contractAddress,
      entrypoint: AMM_METHODS.APPROVE,
      calldata: [AMM_ADDRESS, number.toHex(new BN(amount)), 0],
    };
    const res = await account.execute(call, [LpAbi]);
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};
