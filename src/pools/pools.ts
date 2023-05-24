import { getTokenAddresses } from "../constants/amm";
import { OptionType } from "../types/options";

export interface Token {
  symbol: string;
  decimals: number;
  tokenAddress: string;
}

export enum TokenKeys {
  ETH = "ETH",
  USDC = "USDC",
}

export type TokensList = {
  [key in TokenKeys]: Token;
};

export interface TokenPair {
  type: OptionType;
  base: Token;
  quote: Token;
  symbol: string;
  decimals: number;
  tokenAddress: string;
}

export const tokensList: TokensList = {
  ETH: {
    symbol: "ETH",
    decimals: 18,
    tokenAddress: getTokenAddresses().ETH_ADDRESS,
  },
  USDC: {
    symbol: "USDC",
    decimals: 6,
    tokenAddress: getTokenAddresses().USD_ADDRESS,
  },
};

const ethUsdcPair = {
  base: tokensList.ETH,
  quote: tokensList.USDC,
};

const ethUsdcCall: TokenPair = {
  ...ethUsdcPair,
  ...tokensList.ETH,
  type: OptionType.Call,
};

const ethUsdcPut: TokenPair = {
  ...ethUsdcPair,
  ...tokensList.USDC,
  type: OptionType.Put,
};

const availablePairs = [ethUsdcCall, ethUsdcPut];

export const getTokenPair = (
  type: OptionType,
  base: string,
  quote: string
): TokenPair => {
  const found = availablePairs.find(
    (pair) =>
      pair.type === type &&
      pair.base.tokenAddress === base &&
      pair.quote.tokenAddress === quote
  );

  if (found) {
    return found;
  }

  // unreachable
  throw Error(
    `Could not find pair: type: ${type}, base: ${base}, quote: ${quote}`
  );
};
