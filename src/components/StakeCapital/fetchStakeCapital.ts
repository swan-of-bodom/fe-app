import { QueryFunctionContext } from "react-query";

import { API_URL } from "../../constants/amm";

export const fetchStakeCapital = async ({
  queryKey,
}: QueryFunctionContext<[string, string]>): Promise<any | undefined> => {
  const name = queryKey[1];
  var fields = name.split(" ");
  var pools = fields[0].split("/");
  const pool1 = pools[0].toLowerCase();
  const pool2 = pools[1].toLowerCase();
  const method = fields[1].toLowerCase();
  const url = `${API_URL}${pool1}-${pool2}-${method}/state`;
  const res = await fetch(url);
  const body = await res.json();
  return body;
};
