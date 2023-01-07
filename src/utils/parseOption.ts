import { getTokenAddresses } from "../constants/amm";
import {
  CompositeOption,
  OptionSide,
  OptionStruct,
  OptionType,
  ParsedCallOption,
  ParsedOption,
  ParsedPutOption,
  RawOption,
  RawOptionWithBalance,
} from "../types/options";
import { debug, LogTypes } from "./debugger";
import BN from "bn.js";
import { premiaToUsd, premiaToWei, toHex } from "./utils";
import { bnToOptionSide, bnToOptionType } from "./conversions";

const math61toInt = (bn: BN): number =>
  new BN(bn).div(new BN(2).pow(new BN(61))).toNumber();

export const intToMath61 = (n: number): string =>
  (n * 2 ** 61).toLocaleString("fullwide", { useGrouping: false });

export const parseRawOption = (raw: RawOption): ParsedOption => {
  try {
    return {
      optionSide: bnToOptionSide(raw.option_side),
      optionType: bnToOptionType(raw.option_type),
      maturity: new BN(raw.maturity).toNumber(),
      baseToken: toHex(raw.base_token_address),
      quoteToken: toHex(raw.quote_token_address),
      strikePrice: math61toInt(raw.strike_price).toString(),
      tokenAddress:
        raw.token_address && new BN(raw.token_address).gtn(1)
          ? toHex(raw.token_address)
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

export const parseNewOption = (arr: BN[]): CompositeOption => {
  try {
    const raw = {
      option_side: arr[0],
      maturity: arr[1],
      strike_price: arr[2],
      quote_token_address: arr[3],
      base_token_address: arr[4],
      option_type: arr[5],
      premia: arr[6],
    };

    const type =
      new BN(arr[5]).toString(10) === OptionType.Call
        ? OptionType.Call
        : OptionType.Put;

    if (type === OptionType.Call) {
      const parsed: ParsedCallOption = {
        optionSide:
          new BN(arr[0]).toString(10) === OptionSide.Long
            ? OptionSide.Long
            : OptionSide.Short,
        maturity: new BN(arr[1]).toNumber(),
        strikePrice: new BN(arr[2]).div(new BN(2).pow(new BN(61))).toString(10),
        quoteToken: "0x" + new BN(arr[3]).toString(16),
        baseToken: "0x" + new BN(arr[4]).toString(16),
        optionType:
          new BN(arr[5]).toString(10) === OptionType.Call
            ? OptionType.Call
            : OptionType.Put,
        premiaWei: premiaToWei(arr[6]),
      };
      return { raw, parsed };
    }
    const parsed: ParsedPutOption = {
      optionSide:
        new BN(arr[0]).toString(10) === OptionSide.Long
          ? OptionSide.Long
          : OptionSide.Short,
      maturity: new BN(arr[1]).toNumber(),
      strikePrice: new BN(arr[2]).div(new BN(2).pow(new BN(61))).toString(10),
      quoteToken: "0x" + new BN(arr[3]).toString(16),
      baseToken: "0x" + new BN(arr[4]).toString(16),
      optionType:
        new BN(arr[5]).toString(10) === OptionType.Call
          ? OptionType.Call
          : OptionType.Put,
      premiaUsd: premiaToUsd(arr[6]),
    };
    return { raw, parsed };
  } catch (err) {
    debug("Failed to parse NEW option", err);
    throw new Error("Failed to parse option");
  }
};

export const parseBatchOfOptions = (arr: BN[]): CompositeOption[] => {
  const a = 7;
  const l = arr.length;
  const options = [];

  for (let i = 0; i < l / a; i++) {
    const cur = arr.slice(i * a, (i + 1) * a);
    options.push(parseNewOption(cur));
  }

  return options;
};
