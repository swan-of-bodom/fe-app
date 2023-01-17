import BN from "bn.js";
import { Option, OptionWithPosition } from "../../types/options";
import { math64x61toDecimal, uint256toDecimal } from "../units";
import { assert } from "../utils";
import { parseOption } from "./parseOption";
import { ETH_DIGITS } from "../../constants/amm";

export const parseOptionWithPosition = (arr: BN[]): OptionWithPosition => {
  const expectedLength = 9;

  assert(arr.length === expectedLength, "option with position length");

  const option: Option = parseOption(arr.slice(0, 6));

  const position_size = arr[6];
  const value_of_position = arr[8];

  // Uint256 - just one part
  // ETH_DIGITS for token count
  const positionSize = uint256toDecimal(position_size, ETH_DIGITS);
  // math64_61
  const positionValue = math64x61toDecimal(value_of_position.toString(10));

  const optionWithPosition: OptionWithPosition = {
    raw: {
      ...option.raw,
      position_size,
      value_of_position,
    },
    parsed: {
      ...option.parsed,
      positionSize,
      positionValue,
    },
  };

  return optionWithPosition;
};
