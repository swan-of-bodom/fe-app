import { getTokenAddresses } from "../constants/amm";
import {
  OptionStruct,
  RawOption,
  RawOptionWithBalance,
} from "../types/options";
import { debug } from "./debugger";
import BN from "bn.js";
import { toHex } from "./utils";

export const intToMath61 = (n: number): string =>
  (n * 2 ** 61).toLocaleString("fullwide", { useGrouping: false });

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

export const rawOptionToTokenAddressCalldata = (raw: RawOption): string[] => {
  const res = [
    getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS,
    "0x" + new BN(raw.option_side).toString(16),
    new BN(raw.maturity).toString(10),
    "0x" + new BN(raw.strike_price).toString(16), // TODO: WTF?
  ];
  debug("Option token addresses calldata", res);
  return res;
};

export const isFresh = (raw: RawOption): boolean =>
  new BN(raw.maturity).toNumber() * 1000 > new Date().getTime();

export const hasBalance = (raw: RawOption): raw is RawOptionWithBalance =>
  !!(raw?.balance && new BN(raw.balance).gtn(0));
