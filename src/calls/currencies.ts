export const getCoinUrl = (id = "ethereum", currency = "usd") =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`;

export const getEthInUsd = async (): Promise<number> =>
  fetch(getCoinUrl())
    .then((response) => response.json())
    .then((data) => data.ethereum.usd);
