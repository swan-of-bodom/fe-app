import { debug } from "../../utils/debugger";
import { OptionWithPremia } from "../../classes/Option";
import { getNonExpiredOptions } from "../../calls/getNonExpiredOptions";
import { parseBatchOfOptions } from "../../utils/optionParsers/batch";
import { parseNonExpiredOption } from "../../utils/optionParsers/parseNonExpiredOption";
import { chooseType } from "./chooseType";
import { OptionType } from "../../types/options";

export const fetchOptions = async (): Promise<
  [OptionWithPremia[], OptionType]
> => {
  const [rawDataResult, chosenTypeResult] = await Promise.allSettled([
    getNonExpiredOptions(),
    chooseType(),
  ]);

  if (
    rawDataResult.status === "rejected" ||
    chosenTypeResult.status === "rejected"
  ) {
    debug("Failed fetching options and type", {
      rawDataResult,
      chosenTypeResult,
    });
    return [[], OptionType.Call];
  }

  const rawData = rawDataResult.value;
  const chosenType = chosenTypeResult.value;

  const optionsWithPremia = parseBatchOfOptions(
    rawData,
    7,
    parseNonExpiredOption
  );

  debug("Parsed fetched options", optionsWithPremia);

  return [optionsWithPremia, chosenType];
};
