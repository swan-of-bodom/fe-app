import BN from "bn.js";
import { CompositeOption } from "../../types/options";
import { bnToOptionType, bnToOptionSide } from "../conversions";
import { math64x61toDecimal, uint256toDecimal } from "../units";
import { toHex, digitsByType, assert } from "../utils";

export const parseOptionWithPosition = (arr: BN[]): CompositeOption => {
  const expectedLength = 9;

  assert(arr.length === expectedLength, "option with position length");

  const raw = {
    option_side: arr[0],
    maturity: arr[1],
    strike_price: arr[2],
    quote_token_address: arr[3],
    base_token_address: arr[4],
    option_type: arr[5],
    position_size: arr[6],
    value_of_position: arr[8],
  };

  const optionType = bnToOptionType(raw.option_type);
  const optionSide = bnToOptionSide(raw.option_side);
  const maturity = new BN(raw.maturity).toNumber();
  const strikePrice = String(math64x61toDecimal(raw.strike_price.toString(10)));
  const quoteToken = toHex(raw.quote_token_address);
  const baseToken = toHex(raw.base_token_address);
  // Uint256 - just one part
  const positionSize = uint256toDecimal(
    raw.position_size,
    digitsByType(optionType)
  );
  // math64_61
  const positionValue = math64x61toDecimal(raw.value_of_position.toString(10));

  const parsed = {
    optionSide,
    optionType,
    maturity,
    strikePrice,
    positionSize,
    positionValue,
    quoteToken,
    baseToken,
  };

  return { raw, parsed };
};
