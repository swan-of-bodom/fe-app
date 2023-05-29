import BN from "bn.js";
import {
  Math64x61,
  Address,
  Int,
  Hex,
  Decimal,
  IntBN,
  Math64x61BN,
  OptionSideBN,
  Uint256BN,
} from "./units";
import { ParsedPool, RawPool } from "./pool";

export enum OptionType {
  Call = "0",
  Put = "1",
}

export enum OptionSide {
  Long = "0",
  Short = "1",
}

export interface OptionStruct {
  option_type: Hex;
  strike_price: Math64x61;
  maturity: Int;
  option_side: Hex;
  quote_token_address: Address;
  base_token_address: Address;
}

export interface RawOption extends RawOptionBase {
  token_address?: BN;
  balance?: BN;
  premia?: BN;
  position_size?: BN;
  value_of_position?: BN;
}

export interface RawOptionBase extends RawPool {
  option_side: OptionSideBN;
  maturity: IntBN;
  strike_price: Math64x61BN;
}

export interface ParsedOptionBase extends ParsedPool {
  optionSide: OptionSide;
  maturity: Decimal;
  strikePrice: number;
}

export interface RawOptionWithPosition extends RawOptionBase {
  position_size: Uint256BN;
  value_of_position: Math64x61BN;
}

export interface ParsedOptionWithPosition extends ParsedOptionBase {
  positionSize: Decimal;
  positionValue: Decimal;
}

export interface RawOptionWithPremia extends RawOptionBase {
  premia: Math64x61BN;
}

export interface ParsedOptionWithPremia extends ParsedOptionBase {
  premiaBase: string;
  premiaDecimal: Decimal;
}

export type FinancialData = {
  premiaUsd: number;
  premiaBase: number;
  premiaQuote: number;
  sizeOnePremiaUsd: number;
  sizeOnePremiaBase: number;
  sizeOnePremiaQuote: number;
};
