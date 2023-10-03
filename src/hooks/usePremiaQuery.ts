import { useQuery } from "react-query";
import { getPremia } from "../calls/getPremia";
import { Option } from "../classes/Option";
import { QueryKeys } from "../queries/keys";

export const usePremiaQuery = (
  option: Option,
  size: number,
  isClosing: boolean
) =>
  useQuery<bigint, Error>(
    [QueryKeys.premia, option.optionId, size, isClosing],
    () => getPremia(option, size, isClosing),
    {
      enabled: true, // If we have searchQuery, then enable the query on render
    }
  );
