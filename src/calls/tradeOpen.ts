import {
  AMM_METHODS,
  BASE_MATH_64_61,
  ETH_BASE_VALUE,
  getTokenAddresses,
  USD_BASE_VALUE,
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

/*  call - prevadi se ETH
    put - prevadi se USD

    call opce - approve nad ETH
    put opce - approve nad USD

    call + put -> pokud long
    options_size * premium * (1+slippage)
    short call
    option size - premium * (1-slippage)
    - premium v ETH
    - option size bezrozmerne, ale jakoze v ETH 
    short put
    option size * current underlying price - premium * (1-slippage)
    -> option size - bezrozmerne, ale jakoze v ETH... option size * current underlying price -> v USD (ale jakoze bezrozmerne)
    -> premium v USD */

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

const precision = 10000;

const longCall = (size: number, premia: BN) => {
  const toApprove = new BN(size * precision)
    .mul(premia)
    .mul(new BN(12)) // slippage
    .div(new BN(10))
    .div(new BN(precision));
  debug("LONG CALL calculated to approve", {
    size,
    premia: premia.toString(10),
    toApprove: toApprove.toString(10),
  });
  return toApprove;
};
const shortCall = (size: number, premia: BN) => {
  const base = new BN(size * precision)
    .mul(ETH_BASE_VALUE)
    .div(new BN(precision));

  const toSubtract = premia
    .mul(new BN(9)) // slippage
    .div(new BN(10));

  const toApprove = base.sub(toSubtract);
  debug("SHORT CALL calculated to approve", {
    size,
    premia: premia.toString(10),
    toApprove: toApprove.toString(10),
    base: base.toString(10),
    toSubtract: toSubtract.toString(10),
  });
  return toApprove;
};
const longPut = (size: number, premia: BN) => {
  const toApprove = new BN(size * precision)
    .mul(premia)
    .mul(new BN(11)) // slippage
    .div(new BN(10))
    .div(new BN(precision));
  debug("LONG PUT calculated to approve", {
    size,
    premia: premia.toString(10),
    toApprove: toApprove.toString(10),
  });
};
const shortPut = (size: number, premia: BN) => {
  const ethNow = 1275;
  const base = new BN(size * precision * ethNow)
    .mul(USD_BASE_VALUE)
    .div(new BN(precision));

  const toSubtract = premia
    .mul(new BN(9)) // slippage
    .div(new BN(10));

  const toApprove = base.sub(toSubtract);
  debug("SHORT PUT calculated to approve", {
    size,
    premia: premia.toString(10),
    toApprove: toApprove.toString(10),
    base: base.toString(10),
    toSubtract: toSubtract.toString(10),
  });
  return toApprove;
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

  let toApprove = null;

  if (optionType === OptionType.Call && optionSide === OptionSide.Long) {
    toApprove = longCall(size, premia);
  } else if (optionType === OptionType.Put && optionSide === OptionSide.Long) {
    toApprove = longPut(size, premia);
  } else if (
    optionType === OptionType.Call &&
    optionSide === OptionSide.Short
  ) {
    toApprove = shortCall(size, premia);
  } else if (optionType === OptionType.Put && optionSide === OptionSide.Short) {
    toApprove = shortPut(size, premia);
  }

  if (!toApprove) {
    debug("Si delas prdel, ne?");
    return null;
  }

  toApprove = new BN(toApprove);

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

  const size64x61 = new BN(size * precision)
    .mul(BASE_MATH_64_61)
    .div(new BN(precision))
    .toString(10);

  debug("Approve done, let's trade open...", size64x61);

  const tradeResponse = await tradeOpen(account, option.raw, size64x61);

  debug("Done trading!", tradeResponse);

  return tradeResponse;
};
