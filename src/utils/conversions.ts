import { CompositeOption, OptionSide, OptionType } from "../types/options";
import BN from "bn.js";
import { ETH_DIGITS, USD_DIGITS } from "../constants/amm";
import { isCall } from "./utils";
import { Uint256, bnToUint256 } from "starknet/dist/utils/uint256";
import { longInteger } from "./computations";

export const getBaseAmountWei = (amount: number) =>
  longInteger(amount, 18).toString(16);

export const getBaseAmountUsd = (amount: number) =>
  longInteger(amount, 6).toString(16);

export const convertSizeToInt = (size: number, type: OptionType): string => {
  const digits = isCall(type) ? ETH_DIGITS : USD_DIGITS;
  return longInteger(size, digits).toString(10);
};

export const convertSizeToUint256 = (
  size: number,
  type: OptionType
): Uint256 => {
  const digits = isCall(type) ? ETH_DIGITS : USD_DIGITS;
  return bnToUint256(longInteger(size, digits));
};

export const fullSizeInt = (option: CompositeOption): string => {
  const fullSize = option.raw.position_size;
  if (!fullSize) {
    throw Error("fullSizeInt called without size");
  }
  return new BN(fullSize).toString(10);
};

export const bnToOptionSide = (n: BN): OptionSide =>
  new BN(n).toNumber() === 1 ? OptionSide.Short : OptionSide.Long;

export const bnToOptionType = (n: BN): OptionType =>
  new BN(n).toNumber() === 1 ? OptionType.Put : OptionType.Call;
