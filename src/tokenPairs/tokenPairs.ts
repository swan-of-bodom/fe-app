import { getTokenAddresses } from "../constants/amm";
import { debug } from "../utils/debugger";
import { standardiseAddress } from "../utils/utils";

export interface Token {
  symbol: string;
  decimals: number;
  tokenAddress: string;
}

export interface TokenPair {
  base: Token;
  quote: Token;
}

export enum TokenKeys {
  ETH = "ETH",
  USDC = "USDC",
}

export enum TokenPairKey {
  EthUsdc = "EthUsdc",
}

export type TokensList = {
  [key in TokenKeys]: Token;
};

export type TokenPairList = {
  [key in TokenPairKey]: TokenPair;
};

export const tokensList: TokensList = {
  ETH: {
    symbol: "ETH",
    decimals: 18,
    tokenAddress: standardiseAddress(getTokenAddresses().ETH_ADDRESS),
  },
  USDC: {
    symbol: "USDC",
    decimals: 6,
    tokenAddress: standardiseAddress(getTokenAddresses().USD_ADDRESS),
  },
};

export const tokenPairList: TokenPairList = {
  EthUsdc: {
    base: tokensList.ETH,
    quote: tokensList.USDC,
  },
};

export const getTokenPairByAddresses = (
  base: string,
  quote: string
): TokenPair => {
  debug("getting pair", { base, quote, values: Object.values(tokenPairList) });
  const found = Object.values(tokenPairList).find(
    (pair) =>
      pair.base.tokenAddress === standardiseAddress(base) &&
      pair.quote.tokenAddress === standardiseAddress(quote)
  );

  if (found) {
    return found;
  }

  // unreachable
  throw Error(`Could not find pair: base: ${base}, quote: ${quote}`);
};
