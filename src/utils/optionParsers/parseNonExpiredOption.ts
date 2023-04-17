import BN from "bn.js";
import { assert } from "../utils";
import { parseOption } from "./parseOption";
import { OptionWithPremia } from "../../classes/Option";

export const parseNonExpiredOption = (arr: BN[]): OptionWithPremia => {
  const expectedLength = 7;

  assert(arr.length === expectedLength, "non expired option length");

  const option = parseOption(arr.slice(0, 6));
  const premia = arr[6];

  return option.addPremia(premia);
};
