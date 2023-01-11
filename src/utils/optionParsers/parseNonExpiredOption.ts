import BN from "bn.js";
import { CompositeOption } from "../../types/options";
import { premiaToWei, premiaToUsd, assert, isCall } from "../utils";
import { parseOption } from "./parseOption";

export const parseNonExpiredOption = (arr: BN[]): CompositeOption => {
  const expectedLength = 7;

  assert(arr.length === expectedLength, "non expired option length");

  const option: CompositeOption = parseOption(arr.slice(0, 6));

  option.raw.premia = arr[6];

  isCall(option.parsed.optionType)
    ? (option.parsed.premiaWei = premiaToWei(option.raw.premia))
    : (option.parsed.premiaUsd = premiaToUsd(option.raw.premia));

  return option;
};
