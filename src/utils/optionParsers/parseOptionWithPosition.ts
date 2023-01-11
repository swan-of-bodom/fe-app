import BN from "bn.js";
import { CompositeOption } from "../../types/options";
import { math64x61toDecimal, uint256toDecimal } from "../units";
import { digitsByType, assert } from "../utils";
import { parseOption } from "./parseOption";

export const parseOptionWithPosition = (arr: BN[]): CompositeOption => {
  const expectedLength = 9;

  assert(arr.length === expectedLength, "option with position length");

  const option: CompositeOption = parseOption(arr.slice(0, 6));

  option.raw.position_size = arr[6];
  option.raw.value_of_position = arr[8];

  // Uint256 - just one part
  const positionSize = uint256toDecimal(
    option.raw.position_size,
    digitsByType(option.parsed.optionType)
  );
  // math64_61
  const positionValue = math64x61toDecimal(
    option.raw.value_of_position.toString(10)
  );

  option.parsed.positionSize = positionSize;
  option.parsed.positionValue = positionValue;

  return option;
};
