import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { Abi, AccountInterface } from "starknet";
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
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();
  const contractAddress = isCall(type) ? ETH_ADDRESS : USD_ADDRESS;
  try {
    const call = {
      contractAddress,
      entrypoint: AMM_METHODS.APPROVE,
      calldata: [MAIN_CONTRACT_ADDRESS, number.toHex(new BN(amount)), 0],
    };
    const res = await account.execute(call, [LpAbi] as Abi[]);
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};
