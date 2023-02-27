import { OptionStruct, RawOption, RawOptionBase } from "../types/options";
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

export const rawOptionToStruct = (raw: RawOptionBase): OptionStruct => ({
  option_side: toHex(raw.option_side),
  maturity: new BN(raw.maturity).toString(10),
  strike_price: toHex(raw.strike_price),
  quote_token_address: toHex(raw.quote_token_address),
  base_token_address: toHex(raw.base_token_address),
  option_type: toHex(raw.option_type),
});

export const isFresh = (raw: RawOption): boolean =>
  new BN(raw.maturity).toNumber() * 1000 > new Date().getTime();
