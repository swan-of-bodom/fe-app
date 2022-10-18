import { BigNumberish, toHex } from "starknet/utils/number";
import {
  OptionIdentifier,
  OptionSide,
  OptionType,
  RawOption,
} from "../types/options.d";

const math61toInt = (bn: BigNumberish): number => bnToInt(bn) / 2 ** 61;

export const intToMath61 = (n: number): string =>
  (n * 2 ** 61).toLocaleString("fullwide", { useGrouping: false });

const bnToInt = (bn: BigNumberish): number => parseInt(toHex(bn), 16);

const bnToOptionSide = (bn: BigNumberish): OptionSide =>
  parseInt(toHex(bn), 16) === 1 ? OptionSide.Short : OptionSide.Long;

const bnToOptionType = (bn: BigNumberish): OptionType =>
  parseInt(toHex(bn), 16) === 1 ? OptionType.Put : OptionType.Call;

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
    console.warn("Failed to parse option:", raw);
    console.error(e);
    return null;
  }
};

export const rawOptionToCalldata = (raw: RawOption, size: number): string[] => {
  const optionSize = intToMath61(size);

  return [
    raw.option_type,
    raw.strike_price,
    raw.maturity,
    raw.option_side,
    optionSize,
    raw.quote_token_address,
    raw.base_token_address,
  ];
};
