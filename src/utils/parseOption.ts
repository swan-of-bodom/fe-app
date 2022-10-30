import { BigNumberish, toHex } from "starknet/utils/number";
import { isUint256 } from "starknet/utils/uint256";
import { LPTOKEN_CONTRACT_ADDRESS } from "../constants/amm";
import {
  CompositeOption,
  OptionSide,
  OptionType,
  ParsedOption,
  RawOption,
  RawOptionWithBalance,
} from "../types/options";
import { debug, LogTypes } from "./debugger";

const math61toInt = (bn: BigNumberish): number => bnToInt(bn) / 2 ** 61;

export const intToMath61 = (n: number): string =>
  (n * 2 ** 61).toLocaleString("fullwide", { useGrouping: false });

export const bnToInt = (bn: BigNumberish): number => parseInt(toHex(bn), 16);

const bnToOptionSide = (bn: BigNumberish): OptionSide =>
  parseInt(toHex(bn), 16) === 1 ? OptionSide.Short : OptionSide.Long;

const bnToOptionType = (bn: BigNumberish): OptionType =>
  parseInt(toHex(bn), 16) === 1 ? OptionType.Put : OptionType.Call;

const encodeOptionSize = (n: number): string =>
  Math.floor((n * 2 ** 61) / 10 ** 18).toString(10);

export const parseRawOption = (raw: RawOption): ParsedOption => {
  try {
    return {
      optionSide: bnToOptionSide(raw.option_side),
      optionType: bnToOptionType(raw.option_type),
      maturity: bnToInt(raw.maturity),
      baseToken: toHex(raw.base_token_address),
      quoteToken: toHex(raw.quote_token_address),
      strikePrice: math61toInt(raw.strike_price).toString(),
      tokenAddress: raw.token_address && toHex(raw.token_address),
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

export const rawOptionToCalldata = (raw: RawOption, size: number): string[] => {
  const optionSize = encodeOptionSize(size);

  return [
    toHex(raw.option_type),
    toHex(raw.strike_price),
    bnToInt(raw.maturity).toString(10),
    toHex(raw.option_side),
    optionSize,
    toHex(raw.quote_token_address),
    toHex(raw.base_token_address),
  ];
};

export const rawOptionToTokenAddressCalldata = (raw: RawOption): string[] => {
  return [
    LPTOKEN_CONTRACT_ADDRESS,
    toHex(raw.option_side),
    bnToInt(raw.maturity).toString(10),
    toHex(raw.strike_price),
  ];
};

export const isFresh = (raw: RawOption): boolean =>
  bnToInt(raw.maturity) * 1000 > new Date().getTime();

export const hasBalance = (raw: RawOption): raw is RawOptionWithBalance =>
  !!(raw?.balance && bnToInt(raw.balance) > 0);
