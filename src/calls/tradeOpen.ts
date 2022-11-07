import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import { Abi, AccountInterface, InvokeFunctionResponse } from "starknet";
import { RawOption } from "../types/options";
import { approve } from "./approve";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug, LogTypes } from "../utils/debugger";
import { getProvider } from "../utils/environment";
import { ethToWei, weiTo64x61 } from "../utils/utils";

export const tradeOpen = async (
  account: AccountInterface,
  rawOption: RawOption,
  amount: string
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
    debug("error", "Trade open call failed");
    debug(LogTypes.ERROR, e);
    return null;
  }
};

export const approveAndTrade = async (
  account: AccountInterface,
  rawOption: RawOption,
  amountEth: number
): Promise<InvokeFunctionResponse | null> => {
  const provider = getProvider();

  if (!provider) {
    debug("Failed to get provider inside 'approveAndTrade'");
    return null;
  }

  const amountWei = ethToWei(amountEth);

  const approveResponse = await approve(account, amountWei);

  if (!approveResponse?.transaction_hash) {
    debug("Approve did not return transaction_hash", approveResponse);
    return null;
  }

  await provider.waitForTransaction(approveResponse.transaction_hash);

  const math64x61 = weiTo64x61(amountWei);

  debug("Approve done, let's trade open...", math64x61);

  const tradeResponse = await tradeOpen(account, rawOption, math64x61);

  debug("Done trading!", tradeResponse);

  return tradeResponse;
};
