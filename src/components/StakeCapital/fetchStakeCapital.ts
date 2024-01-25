import { QueryFunctionContext } from "react-query";
import { PairKey } from "../../classes/Pair";
import { API_URL } from "../../constants/amm";

export const fetchStakeCapital = async ({
  queryKey,
}: QueryFunctionContext<[string, any]>): Promise<any | undefined> => {
  const pool = queryKey[1];
  if (pool.pairId === PairKey.ETH_USDC) {
    const url = `${API_URL}eth-usdc-${pool.typeAsText.toLowerCase()}/state`;
    const res = await fetch(url);
    const body = await res.json();
    return body;
  }
};
