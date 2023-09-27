import { OptionWithPremia } from "../classes/Option";
import { API_URL } from "../constants/amm";
import { parseBatchOfOptions } from "../utils/optionParsers/batch";
import { parseNonExpiredOption } from "../utils/optionParsers/parseNonExpiredOption";

export const getNonExpiredOptions = async (): Promise<OptionWithPremia[]> =>
  fetch(`${API_URL}live-options`)
    .then((res) => res.json())
    .then((res) => {
      if (res?.status !== "success" || !res?.data?.length) {
        return [];
      }

      const optionsWithPremia = parseBatchOfOptions(
        res.data.map(BigInt),
        9,
        parseNonExpiredOption
      );

      return optionsWithPremia;
    });
