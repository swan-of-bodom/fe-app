import BN from "bn.js";
import { Envs } from "../redux/reducers/environment";
import { store } from "../redux/store";

type TokenAddresses = {
  ETH_ADDRESS: string;
  USD_ADDRESS: string;
  MAIN_CONTRACT_ADDRESS: string;
  LPTOKEN_CONTRACT_ADDRESS: string;
  LPTOKEN_CONTRACT_ADDRESS_PUT: string;
};

const testnetTokens = {
  ETH_ADDRESS:
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  USD_ADDRESS:
    "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
  MAIN_CONTRACT_ADDRESS:
    "0x042a7d485171a01b8c38b6b37e0092f0f096e9d3f945c50c77799171916f5a54",
  LPTOKEN_CONTRACT_ADDRESS:
    "0x03b176f8e5b4c9227b660e49e97f2d9d1756f96e5878420ad4accd301dd0cc17",
  LPTOKEN_CONTRACT_ADDRESS_PUT:
    "0x0030fe5d12635ed696483a824eca301392b3f529e06133b42784750503a24972",
};

const testnet2Tokens = {
  ETH_ADDRESS:
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  USD_ADDRESS:
    "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
  MAIN_CONTRACT_ADDRESS:
    "0x07e1c9397cc53d1cdf062db6fc8fe5fea9b004e797e4a3e6860ce1090d0586a3",
  LPTOKEN_CONTRACT_ADDRESS:
    "0x00d032817160d5bc6619bed74b392dbdf865c7362e7209acb4853c6e32236983",
  LPTOKEN_CONTRACT_ADDRESS_PUT:
    "0x060ddab9f1646a521b9bc00c942ccb01b8e6a8f0a9637fbd96fd7e7aea27d9b8",
};

export const getTokenAddresses = (): TokenAddresses => {
  const currentEnv = store.getState().environmentSwitch.currentEnv;

  switch (currentEnv) {
    case Envs.Devnet:
      return {
        ETH_ADDRESS: process.env.REACT_APP_ETH_ADDRESS!,
        USD_ADDRESS: process.env.REACT_APP_USD_ADDRESS!,
        MAIN_CONTRACT_ADDRESS: process.env.REACT_APP_MAIN_CONTRACT_ADDRESS!,
        LPTOKEN_CONTRACT_ADDRESS:
          process.env.REACT_APP_LPTOKEN_CONTRACT_ADDRESS!,
        LPTOKEN_CONTRACT_ADDRESS_PUT:
          process.env.REACT_APP_LPTOKEN_CONTRACT_ADDRESS_PUT!,
      };

    case Envs.Testnet:
      return testnetTokens;

    case Envs.Testnet2:
      return testnet2Tokens;

    case Envs.Mainnet:
      // TODO: return mainnet tokens when on mainnet
      return testnetTokens;

    default:
      return testnetTokens;
  }
};

export const enum AMM_METHODS {
  IS_OPTION_AVAILABLE = "is_option_available",
  GET_POOL_AVAILABLE_BALANCE = "get_pool_available_balance",
  APPROVE = "approve",
  TRADE_OPEN = "trade_open",
  TRADE_CLOSE = "trade_close",
  TRADE_SETTLE = "trade_settle",
  GET_AVAILABLE_OPTIONS = "get_available_options",
  GET_OPTION_TOKEN_ADDRESS = "get_option_token_address",
  GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA = "get_all_non_expired_options_with_premia",
  GET_OPTION_WITH_POSITION_OF_USER = "get_option_with_position_of_user",
  DEPOSIT_LIQUIDITY = "deposit_liquidity",
  GET_USER_POOL_INFOS = "get_user_pool_infos",
  WITHDRAW_LIQUIDITY = "withdraw_liquidity",
}

export const SLIPPAGE = 0.1;

export const ETH_BASE_VALUE = new BN(10).pow(new BN(18));
export const USD_BASE_VALUE = new BN(10).pow(new BN(6));
export const BASE_MATH_64_61 = new BN(2).pow(new BN(61));
export const USD_PRECISSION = 1000;
