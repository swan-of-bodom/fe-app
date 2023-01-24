import { OptionSide, OptionType, OptionWithPosition } from "../types/options";
import BN from "bn.js";
import { ETH_DIGITS } from "../constants/amm";
import { uint256 } from "starknet";
import { longInteger } from "./computations";

export const getBaseAmountWei = (amount: number) =>
  longInteger(amount, 18).toString(16);

export const getBaseAmountUsd = (amount: number) =>
  longInteger(amount, 6).toString(16);

export const convertSizeToInt = (size: number): string =>
  longInteger(size, ETH_DIGITS).toString(10);

export const convertSizeToUint256 = (size: number): uint256.Uint256 => {
  return uint256.bnToUint256(longInteger(size, ETH_DIGITS));
};

export const fullSizeInt = (option: OptionWithPosition): string =>
  new BN(option.raw.position_size).toString(10);

export const bnToOptionSide = (n: BN): OptionSide =>
  new BN(n).toNumber() === 1 ? OptionSide.Short : OptionSide.Long;

export const bnToOptionType = (n: BN): OptionType =>
  new BN(n).toNumber() === 1 ? OptionType.Put : OptionType.Call;
