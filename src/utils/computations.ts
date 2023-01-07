import { OptionSide, OptionType } from "../types/options";
import BN from "bn.js";
import { Float, Int } from "../types/base";

type GetApproveAmount = (
  size: number,
  premia: BN,
  slippage: number,
  strike?: number
) => BN;

export const PRECISION = 10000;

const longCall: GetApproveAmount = (size, premia, slippage) =>
  premia
    .mul(new BN(100 + slippage)) // slippage
    .div(new BN(100));

const shortCall: GetApproveAmount = (size, premia, slippage) => {
  const base = longInteger(size, 18);

  const toSubtract = premia
    .mul(new BN(100 - slippage)) // slippage
    .div(new BN(100));

  return base.sub(toSubtract);
};

const longPut: GetApproveAmount = (size, premia, slippage) =>
  premia
    .mul(new BN(100 + slippage)) // slippage
    .div(new BN(100));

const shortPut: GetApproveAmount = (size, premia, slippage, strike): BN => {
  if (!strike) {
    throw new Error("Short Put get to approve did not receive strike price");
  }
  const base = longInteger(size * strike, 6);

  const toSubtract = premia
    .mul(new BN(100 - slippage)) // slippage
    .div(new BN(100));

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

export const getToApprove = (
  type: OptionType,
  side: OptionSide,
  size: number,
  premia: BN,
  strike?: number
): BN => getToApproveFunction(type, side)(size, premia, 10, strike);

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

export const shortInteger = (str: string, digits: Int): Float => {
  if (!str) {
    return 0;
  }
  const padded = str.padStart(digits, "0");
  const [head, tail] = [
    padded.substring(0, padded.length - digits),
    padded.substring(padded.length - digits),
  ];

  return parseFloat(head + "." + tail);
};
