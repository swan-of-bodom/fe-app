export const getCoinUrl = (id = "ethereum", currency = "usd") =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`;

const getCoinInUsd = async (id: string) =>
  fetch(getCoinUrl(id))
    .then((response) => response.json())
    .then((data) => data[id].usd);

export const getEthInUsd = async (): Promise<number> =>
  getCoinInUsd("ethereum");
