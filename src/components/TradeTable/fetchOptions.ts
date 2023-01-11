import { debug } from "../../utils/debugger";
import { CompositeOption } from "../../types/options";
import { getNonExpiredOptions } from "../../calls/getNonExpiredOptions";
import { parseBatchOfOptions } from "../../utils/optionParsers/batch";
import { parseNonExpiredOption } from "../../utils/optionParsers/parseNonExpiredOption";

export const fetchOptions = async (): Promise<CompositeOption[]> => {
  const rawData = await getNonExpiredOptions();

  const compositeOptions = parseBatchOfOptions(
    rawData,
    7,
    parseNonExpiredOption
  );

  debug("Parsed fetched options", compositeOptions);

  return compositeOptions;
};
