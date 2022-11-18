import { ETH_BASE_VALUE, USD_BASE_VALUE } from "../constants/amm";
import { OptionSide, OptionType } from "../types/options";
import BN from "bn.js";
import { getEthInUsd } from "../calls/currencies";

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

type GetApproveAmount = (size: number, premia: BN) => BN | Promise<BN>;

export const PRECISION = 10000;

const longCall: GetApproveAmount = (size, premia) =>
  new BN(size * PRECISION)
    .mul(premia)
    .mul(new BN(12)) // TODO: fix slippage - is now 20% because 10% did not work
    .div(new BN(10))
    .div(new BN(PRECISION));

const shortCall: GetApproveAmount = (size, premia) => {
  const base = new BN(size * PRECISION)
    .mul(ETH_BASE_VALUE)
    .div(new BN(PRECISION));

  const toSubtract = premia
    .mul(new BN(size * PRECISION))
    .mul(new BN(9)) // slippage
    .div(new BN(10))
    .div(new BN(PRECISION));

  return base.sub(toSubtract);
};

const longPut: GetApproveAmount = (size, premia) =>
  new BN(size * PRECISION)
    .mul(premia)
    .mul(new BN(11)) // slippage
    .div(new BN(10))
    .div(new BN(PRECISION));

const shortPut: GetApproveAmount = async (size, premia): Promise<BN> => {
  const ethNow = await getEthInUsd();
  const base = new BN(size * PRECISION * ethNow)
    .mul(USD_BASE_VALUE)
    .div(new BN(PRECISION));

  const toSubtract = premia
    .mul(new BN(size * PRECISION))
    .mul(new BN(9)) // slippage
    .div(new BN(10))
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
    default: // if none of the above - must be shortPut
      return shortPut;
  }
};

export const getToApprove = async (
  type: OptionType,
  side: OptionSide,
  size: number,
  premia: BN
): Promise<BN> => getToApproveFunction(type, side)(size, premia);
