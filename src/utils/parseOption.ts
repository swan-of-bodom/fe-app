import { BigNumberish, toHex } from "starknet/utils/number";
import {
  OptionIdentifier,
  OptionSide,
  OptionType,
  RawOption,
} from "../types/options.d";
import { debug, LogTypes } from "./debugger";

const math61toInt = (bn: BigNumberish): number => bnToInt(bn) / 2 ** 61;

export const intToMath61 = (n: number): string =>
  (n * 2 ** 61).toLocaleString("fullwide", { useGrouping: false });

const bnToInt = (bn: BigNumberish): number => parseInt(toHex(bn), 16);

const bnToOptionSide = (bn: BigNumberish): OptionSide =>
  parseInt(toHex(bn), 16) === 1 ? OptionSide.Short : OptionSide.Long;

const bnToOptionType = (bn: BigNumberish): OptionType =>
  parseInt(toHex(bn), 16) === 1 ? OptionType.Put : OptionType.Call;

const encodeOptionSize = (n: number): string =>
  Math.floor((n * 2 ** 61) / 10 ** 18).toString(10);

export const parseRawOption = (raw: RawOption): OptionIdentifier | null => {
  try {
    return {
      optionSide: bnToOptionSide(raw.option_side),
      optionType: bnToOptionType(raw.option_type),
      maturity: bnToInt(raw.maturity),
      baseToken: toHex(raw.base_token_address),
      quoteToken: toHex(raw.quote_token_address),
      strikePrice: math61toInt(raw.strike_price).toString(),
    };
  } catch (e) {
    debug(LogTypes.ERROR, "Failed to parse option:", raw, e);
    return null;
  }
};

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
