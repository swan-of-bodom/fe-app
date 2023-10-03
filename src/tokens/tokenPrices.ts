import { TokenKey } from "../classes/Token";

type RecentValue = {
  id: TokenKey;
  timestamp: number;
  value: number;
};

const getCoinUrl = (id = "ethereum", currency = "usd") =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`;

const getMulticoinUrl = (ids: TokenKey[], currency = "usd") => {
  const composedIds = ids.reduce(
    (acc, cur, i) => (i === 0 ? cur : acc + "%2C" + cur),
    ""
  );
  return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${composedIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`;
};

const getCoinInUsd = async (id: TokenKey) =>
  fetch(getCoinUrl(id))
    .then((response) => response.json())
    .then((data) => data[id].usd);

const getMultipleCoinsInUsd = async (ids: TokenKey[]): Promise<number[]> =>
  fetch(getMulticoinUrl(ids))
    .then((response) => response.json())
    .then((data) =>
      ids
        .map((id) =>
          data.find(
            (coin: { id: TokenKey; current_price: number }) => coin.id === id
          )
        )
        .map((coin) => coin.current_price)
    );

const freshTime = 30000; // 30s

const isFresh = (recent: RecentValue) =>
  recent.timestamp + freshTime > Date.now();

const tokenValueCache = new Map<TokenKey, RecentValue>();

const checkCache = (id: TokenKey): number | undefined => {
  const fromCache = tokenValueCache.get(id);

  if (fromCache && isFresh(fromCache)) {
    return fromCache.value;
  }
};

export const getTokenValueInUsd = async (id: TokenKey): Promise<number> => {
  const fromCache = checkCache(id);

  if (fromCache !== undefined) {
    return fromCache;
  }

  const value = await getCoinInUsd(id);
  const timestamp = Date.now();
  tokenValueCache.set(id, { value, timestamp, id });
  return value;
};

export const getMultipleTokensValueInUsd = async (
  ids: TokenKey[]
): Promise<number[]> => {
  const fromCache = ids.map((id) => checkCache(id));

  if (fromCache.every(Boolean)) {
    return fromCache as number[];
  }

  const values = await getMultipleCoinsInUsd(ids);
  const timestamp = Date.now();
  ids.forEach((id, index) => {
    tokenValueCache.set(id, { value: values[index], timestamp, id });
  });
  return values;
};
