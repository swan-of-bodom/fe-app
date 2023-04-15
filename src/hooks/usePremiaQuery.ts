import { useQuery } from "react-query";
import { getPremia } from "../calls/getPremia";
import { Option } from "../classes/Option";
import { Math64x61 } from "../types/units";
import { QueryKeys } from "../queries/keys";

export const usePremiaQuery = (
  option: Option,
  size: number,
  isClosing: boolean
) =>
  useQuery<Math64x61, Error>(
    [QueryKeys.premia, option, size, isClosing],
    () => getPremia(option, size, isClosing),
    {
      enabled: true, // If we have searchQuery, then enable the query on render
    }
  );
