import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import {
  Abi,
  AccountInterface,
  InvokeFunctionResponse,
  Provider,
} from "starknet";
import { RawOption } from "../types/options";
import { approve } from "./approve";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug, LogTypes } from "../utils/debugger";

export const tradeOpen = async (
  account: AccountInterface,
  rawOption: RawOption,
  amount: number
) => {
  try {
    const call = {
      contractAddress: getTokenAddresses().MAIN_CONTRACT_ADDRESS,
      entrypoint: AMM_METHODS.TRADE_OPEN,
      calldata: rawOptionToCalldata(rawOption, amount),
    };
    debug("Executing following call:", call);
    const res = await account.execute(call, [AmmAbi] as Abi[]);
    return res;
  } catch (e) {
    debug(LogTypes.ERROR, e);
    return null;
  }
};

export const approveAndTrade = async (
  account: AccountInterface,
  rawOption: RawOption,
  amount: number
): Promise<InvokeFunctionResponse | null> => {
  const provider = new Provider();

  const approveResponse = await approve(account, amount);

  if (!approveResponse?.transaction_hash) {
    debug("Approve did not return transaction_hash", approveResponse);
    return null;
  }

  await provider.waitForTransaction(approveResponse.transaction_hash);

  const tradeResponse = await tradeOpen(account, rawOption, amount);

  debug("Done trading!", tradeResponse);

  return tradeResponse;
};
