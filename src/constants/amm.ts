import { Envs } from "../redux/reducers/environment";
import { store } from "../redux/store";

type TokenAddresses = {
  ETH_ADDRESS: string;
  USD_ADDRESS: string;
  MAIN_CONTRACT_ADDRESS: string;
  LPTOKEN_CONTRACT_ADDRESS: string;
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
      };

    case Envs.Testnet:
      return testnetTokens;

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
  GET_AVAILABLE_OPTIONS = "get_available_options",
  GET_OPTION_TOKEN_ADDRESS = "get_option_token_address",
}
