import { debug } from "../../utils/debugger";
import { OptionWithPremia } from "../../classes/Option";
import { getNonExpiredOptions } from "../../calls/getNonExpiredOptions";
import { parseBatchOfOptions } from "../../utils/optionParsers/batch";
import { parseNonExpiredOption } from "../../utils/optionParsers/parseNonExpiredOption";

export const fetchOptions = async (): Promise<OptionWithPremia[]> => {
  const rawData = await getNonExpiredOptions();

  const optionsWithPremia = parseBatchOfOptions(
    rawData,
    7,
    parseNonExpiredOption
  );

  debug("Parsed fetched options", optionsWithPremia);

  return optionsWithPremia;
};
