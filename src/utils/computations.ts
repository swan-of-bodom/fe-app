import { FinancialData, OptionSide, OptionType } from "../types/options";
import BN from "bn.js";
import { Decimal } from "../types/units";
import { ETH_DIGITS, USD_DIGITS } from "../constants/amm";
import { store } from "../redux/store";
import { isCall, isLong } from "./utils";
import { debug } from "./debugger";

type GetApproveAmount = (size: number, premia: BN, strike?: number) => BN;

export const PRECISION = 10000;

const shortCall: GetApproveAmount = (size, premia) => {
  const base = longInteger(size, ETH_DIGITS);

  const res = base.sub(premia);

  if (res.ltn(0)) {
    // if this is true, users can get more money
    // than they are locking in - BIG NONO
    throw Error("Premia greater than size!");
  }

  return res;
};

const shortPut: GetApproveAmount = (size, premia, strike): BN => {
  if (!strike) {
    throw new Error("Short Put get to approve did not receive strike price");
  }
  const base = longInteger(size * strike, USD_DIGITS);

  return base.sub(premia);
};

export const getPremiaWithSlippage = (premia: BN, side: OptionSide): BN => {
  const { slippage } = store.getState().settings;
  const fullInBasisPoints = 10000;
  // slippage is in percentage, with 2 decimal precission
  const slippageInBasisPoints = Math.round(slippage * 100);
  const numerator =
    fullInBasisPoints +
    (isLong(side) ? slippageInBasisPoints : -slippageInBasisPoints);

  const res = premia.mul(new BN(numerator)).div(new BN(fullInBasisPoints));

  debug("Slippage calculator", {
    slippageInBasisPoints,
    numerator,
    premia: premia.toString(10),
    res: res.toString(10),
  });
  return res;
};

export const getToApprove = (
  type: OptionType,
  side: OptionSide,
  size: number,
  premia: BN,
  strike?: number
): BN => {
  const premiaWithSlippage = getPremiaWithSlippage(premia, side);

  if (isLong(side)) {
    // long call / long put - premia with slippage
    return premiaWithSlippage;
  }

  if (isCall(type)) {
    // short call - locked capital minus premia with slippage
    return shortCall(size, premia);
  }

  // short put - locked capital minus premia with slippage
  // locked capital is size * strike price
  return shortPut(size, premia, strike);
};

export const longInteger = (n: Decimal, digits: number): BN => {
  if (!n) {
    return new BN(0);
  }
  const str = n.toString(10);
  const nonScientificNotation = str.includes("e")
    ? Number(str).toFixed(50)
    : str;
  const [lead, dec] = nonScientificNotation.split(".");

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

export const shortInteger = (str: string, digits: number): Decimal => {
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

export const financialDataEth = (
  basePremiaEth: number,
  premiaEth: number,
  ethInUsd: number
): FinancialData => {
  const basePremiaUsd = basePremiaEth * ethInUsd;

  return {
    premiaEth,
    premiaUsd: premiaEth * ethInUsd,
    basePremiaEth,
    basePremiaUsd,
    ethInUsd,
  };
};

export const financialDataUsd = (
  basePremiaUsd: number,
  premiaUsd: number,
  ethInUsd: number
): FinancialData => {
  const basePremiaEth = basePremiaUsd / ethInUsd;

  return {
    premiaEth: premiaUsd / ethInUsd,
    premiaUsd,
    basePremiaEth,
    basePremiaUsd,
    ethInUsd,
  };
};
