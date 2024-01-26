import { QueryFunctionContext } from "react-query";
import { apiUrl } from "../../api";

export const fetchStakeCapital = async ({
  queryKey,
}: QueryFunctionContext<[string, any]>): Promise<any | undefined> => {
  const pool = queryKey[1];
  const url = apiUrl(`${pool.apiPoolId}/state`);
  const res = await fetch(url);
  const body = await res.json();
  return body;
};
