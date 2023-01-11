import { OptionStruct, RawOption } from "../types/options";
import BN from "bn.js";
import { toHex } from "./utils";

export const rawOptionToCalldata = (raw: RawOption, size: string): string[] => {
  return [
    toHex(raw.option_type),
    toHex(raw.strike_price),
    new BN(raw.maturity).toString(10),
    toHex(raw.option_side),
    size,
    toHex(raw.quote_token_address),
    toHex(raw.base_token_address),
  ];
};

export const rawOptionToStruct = (raw: RawOption): OptionStruct => {
  return [
    toHex(raw.option_side),
    new BN(raw.maturity).toString(10),
    toHex(raw.strike_price),
    toHex(raw.quote_token_address),
    toHex(raw.base_token_address),
    toHex(raw.option_type),
  ];
};

export const isFresh = (raw: RawOption): boolean =>
  new BN(raw.maturity).toNumber() * 1000 > new Date().getTime();
