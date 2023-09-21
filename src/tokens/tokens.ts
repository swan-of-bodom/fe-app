import { Pool } from "../classes/Pool";
import { ETH_ADDRESS, USDC_ADDRESS } from "../constants/amm";
import { OptionType } from "../types/options";
import { standardiseAddress } from "../utils/utils";

export interface Token {
  id: TokenKey;
  symbol: string;
  decimals: number;
  tokenAddress: string;
}

export interface TokenPair {
  base: Token;
  quote: Token;
}

export enum TokenKey {
  // coingecko API is used for fetching the prices
  // the string value must always be "id" taken from
  // https://api.coingecko.com/api/v3/coins/list
  ETH = "ethereum",
  USDC = "usd-coin",
}

export enum TokenPairKey {
  EthUsdc = "EthUsdc",
}

export type TokensList = {
  [key in TokenKey]: Token;
};

export type TokenPairList = {
  [key in TokenPairKey]: TokenPair;
};

export const tokensList: TokensList = {
  [TokenKey.ETH]: {
    id: TokenKey.ETH,
    symbol: "ETH",
    decimals: 18,
    tokenAddress: standardiseAddress(ETH_ADDRESS),
  },
  [TokenKey.USDC]: {
    id: TokenKey.USDC,
    symbol: "USDC",
    decimals: 6,
    tokenAddress: standardiseAddress(USDC_ADDRESS),
  },
};

export const tokenPairList: TokenPairList = {
  EthUsdc: {
    base: tokensList[TokenKey.ETH],
    quote: tokensList[TokenKey.USDC],
  },
};

export const getTokenPairByAddresses = (
  base: string,
  quote: string
): TokenPair => {
  const standardisedBase = standardiseAddress(base);
  const standardisedQuote = standardiseAddress(quote);

  const found = Object.values(tokenPairList).find(
    (pair) =>
      pair.base.tokenAddress === standardisedBase &&
      pair.quote.tokenAddress === standardisedQuote
  );

  if (found) {
    return found;
  }

  // unreachable
  throw Error(`Could not find pair: base: ${base}, quote: ${quote}`);
};

export const getPoolByPairType = (
  pairKey: TokenPairKey,
  type: OptionType
): Pool => {
  const pair = tokenPairList[pairKey];

  return new Pool({
    parsed: {
      optionType: type,
      baseToken: pair.base.tokenAddress,
      quoteToken: pair.quote.tokenAddress,
    },
  });
};
