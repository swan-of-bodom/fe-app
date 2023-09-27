import { BigNumberish } from "starknet";
import { Pool } from "../classes/Pool";
import { BTC_ADDRESS, ETH_ADDRESS, USDC_ADDRESS } from "../constants/amm";
import { OptionType } from "../types/options";
import { isEqual, standardiseAddress } from "../utils/utils";

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
  BTC = "bridged-wrapped-bitcoin-stargate",
}

export enum TokenPairKey {
  EthUsdc = "EthUsdc",
  BtcUsdc = "BtcUsdc",
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
  [TokenKey.BTC]: {
    id: TokenKey.BTC,
    symbol: "BTC",
    decimals: 8,
    tokenAddress: standardiseAddress(BTC_ADDRESS),
  },
};

export const tokens: Token[] = [
  {
    id: TokenKey.ETH,
    symbol: "ETH",
    decimals: 18,
    tokenAddress: standardiseAddress(ETH_ADDRESS),
  },
  {
    id: TokenKey.USDC,
    symbol: "USDC",
    decimals: 6,
    tokenAddress: standardiseAddress(USDC_ADDRESS),
  },
  {
    id: TokenKey.BTC,
    symbol: "BTC",
    decimals: 8,
    tokenAddress: standardiseAddress(BTC_ADDRESS),
  },
];

export const tokenPairList: TokenPairList = {
  EthUsdc: {
    base: tokensList[TokenKey.ETH],
    quote: tokensList[TokenKey.USDC],
  },
  BtcUsdc: {
    base: tokensList[TokenKey.BTC],
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

  return new Pool(pair.base.tokenAddress, pair.quote.tokenAddress, type);
};

export const getTokenByAddress = (address: BigNumberish): Token => {
  const match = tokens.find((t) => isEqual(address, t.tokenAddress));

  if (match) {
    return match;
  }

  // unreachable
  throw Error(`Invalid token address: ${address}`);
};
