import { TokenKey } from "./tokens";

type RecentValue = {
  id: TokenKey;
  timestamp: number;
  value: number;
};

export const getCoinUrl = (id = "ethereum", currency = "usd") =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`;

const getCoinInUsd = async (id: TokenKey) =>
  fetch(getCoinUrl(id))
    .then((response) => response.json())
    .then((data) => data[id].usd);

const freshTime = 30000; // 30s

const isFresh = (recent: RecentValue) =>
  recent.timestamp < Date.now() + freshTime;

const tokenValueCache = new Map<TokenKey, RecentValue>();

/**
 * Returns array of values in the order of the ids.
 * @param ids Array of TokenKeys that should be retrieved
 */
const getTokenValueInUsd = async (id: TokenKey): Promise<number> => {
  const fromCache = tokenValueCache.get(id);

  if (fromCache && isFresh(fromCache)) {
    return fromCache.value;
  }

  const value = await getCoinInUsd(id);
  const timestamp = Date.now();
  tokenValueCache.set(id, { value, timestamp, id });
  return value;
};
