import BN from "bn.js";
import {
  Math64x61,
  Address,
  Int,
  Uint256LeadingNumber,
  Uint256TailZero,
  Hex,
  Decimal,
  AddressBN,
  IntBN,
  Math64x61BN,
  OptionSideBN,
  OptionTypeBN,
  Uint256BN,
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

export type _OptionWithPremia = [...OptionStruct, Math64x61];

export type OptionWithUsersPosition = [
  ...OptionStruct,
  Uint256LeadingNumber,
  Uint256TailZero,
  Math64x61
];

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

export interface RawOptionBase {
  option_side: OptionSideBN;
  maturity: IntBN;
  strike_price: Math64x61BN;
  quote_token_address: AddressBN;
  base_token_address: AddressBN;
  option_type: OptionTypeBN;
}

export interface ParsedOptionBase {
  optionSide: OptionSide;
  maturity: Decimal;
  strikePrice: string;
  quoteToken: string;
  baseToken: string;
  optionType: OptionType;
}

export interface Option {
  raw: RawOptionBase;
  parsed: ParsedOptionBase;
}

export interface RawOptionWithPosition extends RawOptionBase {
  position_size: Uint256BN;
  value_of_position: Math64x61BN;
}

export interface ParsedOptionWithPosition extends ParsedOptionBase {
  positionSize: Decimal;
  positionValue: Decimal;
}

export interface OptionWithPosition {
  raw: RawOptionWithPosition;
  parsed: ParsedOptionWithPosition;
}

export interface RawOptionWithPremia extends RawOptionBase {
  premia: Math64x61BN;
}

export interface ParsedOptionWithPremia extends ParsedOptionBase {
  premiaBase: string;
  premiaDecimal: Decimal;
}

export interface OptionWithPremia {
  raw: RawOptionWithPremia;
  parsed: ParsedOptionWithPremia;
}

export type FinancialData = {
  premiaUsd: number;
  premiaEth: number;
  basePremiaUsd: number;
  basePremiaEth: number;
  ethInUsd: number;
};
