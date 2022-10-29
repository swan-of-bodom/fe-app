// option_type : OptionType,
// strike_price : Math64x61_,
// maturity : Int,
// option_side : OptionSide,
// option_size : Math64x61_,
// quote_token_address: Address,
// base_token_address: Address,

import { BigNumberish } from "starknet/utils/number";

export type RawHighLow = {
  low: BigNumberish;
  high: BigNumberish;
};

export type HighLow = {
  low: number;
  high: number;
};

export enum OptionType {
  Call = "0",
  Put = "1",
}

export enum OptionSide {
  Long = "0",
  Short = "1",
}

export type ParsedOption = {
  optionType: OptionType;
  strikePrice: string;
  maturity: number;
  optionSide: OptionSide;
  quoteToken: string;
  baseToken: string;
  tokenAddress?: string;
};

export interface RawOption {
  option_side: BigNumberish;
  maturity: BigNumberish;
  strike_price: BigNumberish;
  quote_token_address: BigNumberish;
  base_token_address: BigNumberish;
  option_type: BigNumberish;
  token_address?: BigNumberish;
  high_low?: HighLow;
}

export interface RawOptionWithHighLow extends RawOption {
  high_low: HighLow;
}

export type OptionTradeArguments = ParsedOption & { optionSize: string };

export type CompositeOption = {
  raw: RawOption;
  parsed: ParsedOption;
};

export type CompositeOptionWithBalance = {
  raw: RawOptionWithHighLow;
  parsed: ParsedOption;
};