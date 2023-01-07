// option_type : OptionType,
// strike_price : Math64x61_,
// maturity : Int,
// option_side : OptionSide,
// option_size : Math64x61_,
// quote_token_address: Address,
// base_token_address: Address,

import BN from "bn.js";
import {
  Math64x61,
  Address,
  Int,
  Uint256LeadingNumber,
  Uint256TailZero,
  Hex,
} from "./units";

export enum OptionType {
  Call = "0",
  Put = "1",
}

export enum OptionSide {
  Long = "0",
  Short = "1",
}

export type OptionStruct = [Hex, Int, Math64x61, Address, Address, Hex];

export type OptionWithPremia = [...OptionStruct, Math64x61];

export type OptionWithUsersPosition = [
  ...OptionStruct,
  Uint256LeadingNumber,
  Uint256TailZero,
  Math64x61
];

export interface ParsedOption {
  optionType: OptionType;
  strikePrice: string;
  maturity: number;
  optionSide: OptionSide;
  quoteToken: string;
  baseToken: string;
  tokenAddress?: string;
  premiaWei?: string;
  premiaUsd?: string;
  positionSize?: number;
  positionValue?: number;
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
  option_side: BN;
  maturity: BN;
  strike_price: BN;
  quote_token_address: BN;
  base_token_address: BN;
  option_type: BN;
  token_address?: BN;
  balance?: BN;
  premia?: BN;
  position_size?: BN;
  value_of_position?: BN;
}

export interface RawOptionWithBalance extends RawOption {
  balance: BN;
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
