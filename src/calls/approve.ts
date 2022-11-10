import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { Abi, AccountInterface } from "starknet";
import { toBN, toHex } from "starknet/utils/number";
import LpAbi from "../abi/lptoken_abi.json";
import { debug, LogTypes } from "../utils/debugger";
import { OptionType } from "../types/options";
import BN from "bn.js";

export const approveCall = async (
  account: AccountInterface,
  amount: string
) => {
  const { ETH_ADDRESS, MAIN_CONTRACT_ADDRESS } = getTokenAddresses();

  try {
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

export const approvePut = async (account: AccountInterface, amount: string) => {
  const { USD_ADDRESS, MAIN_CONTRACT_ADDRESS } = getTokenAddresses();

  try {
    const call = {
      contractAddress: USD_ADDRESS,
      entrypoint: AMM_METHODS.APPROVE,
      calldata: [MAIN_CONTRACT_ADDRESS, toHex(new BN(amount)), 0],
    };
    const res = await account.execute(call, [LpAbi] as Abi[]);
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};

// TODO: ETH_ADDRES for call options
// USD_ADDRESS for put options
export const approve = async (
  type: OptionType,
  account: AccountInterface,
  amount: string
) =>
  type === OptionType.Call
    ? approveCall(account, amount)
    : approvePut(account, amount);
