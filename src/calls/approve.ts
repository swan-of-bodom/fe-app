import {
  AMM_METHODS,
  ETH_ADDRESS,
  MAIN_CONTRACT_ADDRESS,
} from "../constants/amm";
import { Abi, AccountInterface } from "starknet";
import { toBN, toHex } from "starknet/utils/number";
import LpAbi from "../abi/lptoken_abi.json";
import { debug, LogTypes } from "../utils/debugger";

export const approve = async (account: AccountInterface, amount: number) => {
  try {
    const call = {
      contractAddress: ETH_ADDRESS,
      entrypoint: AMM_METHODS.APPROVE,
      calldata: [MAIN_CONTRACT_ADDRESS, toHex(toBN(amount * 2)), 0],
    };
    const res = await account.execute(call, [LpAbi] as Abi[]);
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};
