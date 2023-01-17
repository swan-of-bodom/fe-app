import BN from "bn.js";
import { Option } from "../../types/options";
import { bnToOptionType, bnToOptionSide } from "../conversions";
import { math64x61toDecimal } from "../units";
import { toHex, assert } from "../utils";

export const parseOption = (arr: BN[]): Option => {
  const expectedLength = 6;

  assert(arr.length === expectedLength, "option with position length");

  const raw = {
    option_side: arr[0],
    maturity: arr[1],
    strike_price: arr[2],
    quote_token_address: arr[3],
    base_token_address: arr[4],
    option_type: arr[5],
  };

  const optionType = bnToOptionType(raw.option_type);
  const optionSide = bnToOptionSide(raw.option_side);
  const maturity = new BN(raw.maturity).toNumber();
  const strikePrice = String(math64x61toDecimal(raw.strike_price.toString(10)));
  const quoteToken = toHex(raw.quote_token_address);
  const baseToken = toHex(raw.base_token_address);

  const parsed = {
    optionSide,
    optionType,
    maturity,
    strikePrice,
    quoteToken,
    baseToken,
  };

  return { raw, parsed };
};
