import BN from "bn.js";
import { Option, OptionWithPremia } from "../../types/options";
import { assert, digitsByType } from "../utils";
import { parseOption } from "./parseOption";
import { intToDecimal, math64x61ToInt } from "../units";

export const parseNonExpiredOption = (arr: BN[]): OptionWithPremia => {
  const expectedLength = 7;

  assert(arr.length === expectedLength, "non expired option length");

  const option: Option = parseOption(arr.slice(0, 6));

  const premia = arr[6];
  const digits = digitsByType(option.parsed.optionType);
  const premiaBase = math64x61ToInt(premia.toString(10), digits);

  const premiaDecimal = intToDecimal(premiaBase, digits);

  const optionWithPremia: OptionWithPremia = {
    raw: {
      ...option.raw,
      premia,
    },
    parsed: {
      ...option.parsed,
      premiaBase,
      premiaDecimal,
    },
  };

  return optionWithPremia;
};
