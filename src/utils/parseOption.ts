import { BigNumberish } from "starknet/utils/number";
import { getTokenAddresses } from "../constants/amm";
import {
  CompositeOption,
  OptionSide,
  OptionType,
  ParsedOption,
  RawOption,
  RawOptionWithBalance,
} from "../types/options";
import { debug, LogTypes } from "./debugger";
import BN from "bn.js";

const math61toInt = (bn: BigNumberish): number =>
  new BN(bn).div(new BN(2).pow(new BN(61))).toNumber();

export const intToMath61 = (n: number): string =>
  (n * 2 ** 61).toLocaleString("fullwide", { useGrouping: false });

export const bnToInt = (n: BigNumberish): number => new BN(n).toNumber();

const bnToOptionSide = (n: BigNumberish): OptionSide =>
  new BN(n).toNumber() === 1 ? OptionSide.Short : OptionSide.Long;

const bnToOptionType = (n: BigNumberish): OptionType =>
  new BN(n).toNumber() === 1 ? OptionType.Put : OptionType.Call;

export const parseRawOption = (raw: RawOption): ParsedOption => {
  try {
    return {
      optionSide: bnToOptionSide(raw.option_side),
      optionType: bnToOptionType(raw.option_type),
      maturity: bnToInt(raw.maturity),
      baseToken: "0x" + new BN(raw.base_token_address).toString(16),
      quoteToken: "0x" + new BN(raw.quote_token_address).toString(16),
      strikePrice: math61toInt(raw.strike_price).toString(),
      tokenAddress:
        raw.token_address && new BN(raw.token_address).gtn(1)
          ? "0x" + new BN(raw.token_address).toString(16)
          : undefined,
    };
  } catch (e) {
    debug(LogTypes.ERROR, "Failed to parse option:", raw, e);
    throw new Error(`Failed to parse option ${JSON.stringify(raw)}`);
  }
};

export const composeOption = (raw: RawOption): CompositeOption => ({
  raw,
  parsed: parseRawOption(raw),
});

export const rawOptionToCalldata = (raw: RawOption, size: string): string[] => {
  return [
    "0x" + new BN(raw.option_type).toString(16),
    "0x" + new BN(raw.strike_price).toString(16),
    new BN(raw.maturity).toString(10),
    "0x" + new BN(raw.option_side).toString(16),
    size,
    "0x" + new BN(raw.quote_token_address).toString(16),
    "0x" + new BN(raw.base_token_address).toString(16),
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
  bnToInt(raw.maturity) * 1000 > new Date().getTime();

export const hasBalance = (raw: RawOption): raw is RawOptionWithBalance =>
  !!(raw?.balance && new BN(raw.balance).gtn(1));
