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
import { premiaToUsd, premiaToWei } from "./utils";

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
    const parsed = {
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
      premiaWei: premiaToWei(arr[6]),
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
