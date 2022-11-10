import {
  AMM_METHODS,
  BASE_MATH_64_61,
  getTokenAddresses,
} from "../constants/amm";
import AmmAbi from "../abi/amm_abi.json";
import { Abi, AccountInterface, InvokeFunctionResponse } from "starknet";
import {
  CompositeOption,
  OptionSide,
  OptionType,
  RawOption,
} from "../types/options";
import { approve } from "./approve";
import { rawOptionToCalldata } from "../utils/parseOption";
import { debug, LogTypes } from "../utils/debugger";
import { getProvider } from "../utils/environment";
import BN from "bn.js";
import { getToApprove, PRECISION } from "../utils/computations";

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
  option: CompositeOption,
  size: number,
  optionType: OptionType,
  optionSide: OptionSide,
  premia: BN
): Promise<InvokeFunctionResponse | null> => {
  const provider = getProvider();

  if (!provider) {
    debug("Failed to get provider inside 'approveAndTrade'");
    return null;
  }

  const toApprove = getToApprove(optionType, optionSide, size, premia);

  debug("Calculated toApprove", {
    optionType,
    optionSide,
    size,
    premia: premia.toString(10),
    toApprove: toApprove.toString(10),
  });

  const approveResponse = await approve(
    option.parsed.optionType,
    account,
    toApprove.toString(10)
  );

  if (!approveResponse?.transaction_hash) {
    debug("Approve did not return transaction_hash", approveResponse);
    return null;
  }

  await provider.waitForTransaction(approveResponse.transaction_hash);

  const size64x61 = new BN(size * PRECISION)
    .mul(BASE_MATH_64_61)
    .div(new BN(PRECISION))
    .toString(10);

  debug("Approve done, let's trade open...", size64x61);

  const tradeResponse = await tradeOpen(account, option.raw, size64x61);

  debug("Done trading!", tradeResponse);

  return tradeResponse;
};
