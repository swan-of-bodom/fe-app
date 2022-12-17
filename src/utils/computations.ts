import { OptionSide, OptionType } from "../types/options";
import BN from "bn.js";
import { getEthInUsd } from "../calls/currencies";
import { Float, Int } from "../types/base";

/*  call - prevadi se ETH
    put - prevadi se USD

    call opce - approve nad ETH
    put opce - approve nad USD

    call + put -> pokud long
    options_size * premium * (1+slippage)
    short call
    option size - option size * premium * (1-slippage)
    - premium v ETH
    - option size bezrozmerne, ale jakoze v ETH 
    short put
    option size * current underlying price - option size * premium * (1-slippage)
    -> option size - bezrozmerne, ale jakoze v ETH... option size * current underlying price -> v USD (ale jakoze bezrozmerne)
    -> premium v USD */

type GetApproveAmount = (
  size: number,
  premia: BN,
  slippage: number
) => BN | Promise<BN>;

export const PRECISION = 10000;

const longCall: GetApproveAmount = (size, premia, slippage) =>
  new BN(size * PRECISION)
    .mul(premia)
    .mul(new BN(100 + slippage)) // slippage
    .div(new BN(100))
    .div(new BN(PRECISION));

const shortCall: GetApproveAmount = (size, premia, slippage) => {
  const base = longInteger(size, 18);

  const toSubtract = premia
    .mul(new BN(size * PRECISION))
    .mul(new BN(100 - slippage)) // slippage
    .div(new BN(100))
    .div(new BN(PRECISION));

  return base.sub(toSubtract);
};

const longPut: GetApproveAmount = (size, premia, slippage) =>
  new BN(size * PRECISION)
    .mul(premia)
    .mul(new BN(100 + slippage)) // slippage
    .div(new BN(100))
    .div(new BN(PRECISION));

const shortPut: GetApproveAmount = async (
  size,
  premia,
  slippage
): Promise<BN> => {
  const ethNow = await getEthInUsd();
  const base = longInteger(size * ethNow, 6);

  const toSubtract = premia
    .mul(new BN(size * PRECISION))
    .mul(new BN(100 - slippage)) // slippage
    .div(new BN(100))
    .div(new BN(PRECISION));

  return base.sub(toSubtract);
};

const getToApproveFunction = (
  type: OptionType,
  side: OptionSide
): GetApproveAmount => {
  switch (type + side) {
    case OptionType.Call + OptionSide.Long:
      return longCall;
    case OptionType.Call + OptionSide.Short:
      return shortCall;
    case OptionType.Put + OptionSide.Long:
      return longPut;
    case OptionType.Put + OptionSide.Short:
      return shortPut;
    default: // if none of the above - throw error
      throw Error("Got invalid type/side values");
  }
};

export const getToApprove = async (
  type: OptionType,
  side: OptionSide,
  size: number,
  premia: BN
): Promise<BN> => getToApproveFunction(type, side)(size, premia, 10);

export const longInteger = (n: Float, digits: Int): BN => {
  if (!n) {
    return new BN(0);
  }
  const [lead, dec] = n.toString(10).split(".");

  if (!dec) {
    return new BN(lead + "".padEnd(digits, "0"));
  }

  const tail = dec
    .padEnd(digits, "0") // pad ending with 0s
    .substring(0, digits); // if more digits than should be, cut them out

  const withLeadingZeros = lead + tail;
  const leadingZeros = withLeadingZeros.match(/^0*([0-9]+)/);

  return leadingZeros && leadingZeros?.length > 1
    ? new BN(leadingZeros[1])
    : new BN(0);
};

export const getBaseAmountWei = (amount: number) =>
  longInteger(amount, 18).toString(16);

export const getBaseAmountUsd = (amount: number) =>
  longInteger(amount, 6).toString(16);
