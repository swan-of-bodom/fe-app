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

export type OptionIdentifier = {
  optionType: OptionType;
  strikePrice: string;
  maturity: number;
  optionSide: OptionSide;
  quoteToken: string;
  baseToken: string;
};

export type RawOption = {
  option_side: BigNumberish;
  maturity: BigNumberish;
  strike_price: BigNumberish;
  quote_token_address: BigNumberish;
  base_token_address: BigNumberish;
  option_type: BigNumberish;
};

export type OptionTradeArguments = OptionIdentifier & { optionSize: string };
