// option_type : OptionType,
// strike_price : Math64x61_,
// maturity : Int,
// option_side : OptionSide,
// option_size : Math64x61_,
// quote_token_address: Address,
// base_token_address: Address,

import { BigNumberish } from "starknet/utils/number";

export enum OptionType {
  Call = "0",
  Put = "1",
}

export enum OptionSide {
  Long = "0",
  Short = "1",
}

export interface ParsedOption {
  optionType: OptionType;
  strikePrice: string;
  maturity: number;
  optionSide: OptionSide;
  quoteToken: string;
  baseToken: string;
  tokenAddress?: string;
}

export interface ParsedCallOption extends ParsedOption {
  premiaWei: string;
}

export interface ParsedPutOption extends ParsedOption {
  premiaUsd: string;
}

export interface ParsedOptionWithPosition extends ParsedOption {
  positionSize: number;
  positionValue: number;
}

export interface RawOption {
  option_side: BigNumberish;
  maturity: BigNumberish;
  strike_price: BigNumberish;
  quote_token_address: BigNumberish;
  base_token_address: BigNumberish;
  option_type: BigNumberish;
  token_address?: BigNumberish;
  balance?: BigNumberish;
  premia?: BigNumberish;
  position_size?: BigNumberish;
  value_of_position?: BigNumberish;
}

export interface RawOptionWithBalance extends RawOption {
  balance: BigNumberish;
}

export type OptionTradeArguments = ParsedOption & { optionSize: string };

export type CompositeOption = {
  raw: RawOption;
  parsed:
    | ParsedOption
    | ParsedCallOption
    | ParsedPutOption
    | ParsedOptionWithPosition;
};

export type CompositeOptionWithBalance = {
  raw: RawOptionWithBalance;
  parsed:
    | ParsedOption
    | ParsedCallOption
    | ParsedPutOption
    | ParsedOptionWithPosition;
};

export type OptionStruct = string[];
