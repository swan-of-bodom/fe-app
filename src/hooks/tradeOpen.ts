import { AMM_METHODS, MAIN_CONTRACT_ADDRESS } from "../constants/amm";
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

export const tradeOpen = async (
  account: AccountInterface,
  rawOption: RawOption,
  amount: number
) => {
  try {
    const res = await account.execute(
      {
        contractAddress: MAIN_CONTRACT_ADDRESS,
        entrypoint: AMM_METHODS.TRADE_OPEN,
        calldata: rawOptionToCalldata(rawOption, amount),
      },
      [AmmAbi] as Abi[]
    );
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const approveAndTrade = async (
  account: AccountInterface,
  address: string,
  rawOption: RawOption,
  amount: number
): Promise<InvokeFunctionResponse | null> => {
  const provider = new Provider();

  const approveResponse = await approve(account, address, amount.toString());

  console.log("Approve response", approveResponse);

  if (!approveResponse?.transaction_hash) {
    return null;
  }

  await provider.waitForTransaction(approveResponse.transaction_hash);

  console.log("Done waiting for approve", approveResponse);

  const tradeResponse = await tradeOpen(account, rawOption, amount);

  console.log("Done trading", tradeResponse);

  return tradeResponse;
};
