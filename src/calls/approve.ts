import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { Abi, AccountInterface } from "starknet";
import { toBN, toHex } from "starknet/utils/number";
import LpAbi from "../abi/lptoken_abi.json";
import { debug, LogTypes } from "../utils/debugger";

export const approve = async (account: AccountInterface, amount: string) => {
  try {
    const { ETH_ADDRESS, MAIN_CONTRACT_ADDRESS } = getTokenAddresses();
    const call = {
      contractAddress: ETH_ADDRESS,
      entrypoint: AMM_METHODS.APPROVE,
      calldata: [MAIN_CONTRACT_ADDRESS, toHex(toBN(amount)), 0],
    };
    const res = await account.execute(call, [LpAbi] as Abi[]);
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};
