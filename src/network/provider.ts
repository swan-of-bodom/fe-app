import { RpcProvider, RpcProviderOptions } from "starknet";
import { Network, NetworkName } from "../types/network";
import { constants } from "starknet";
import { NETWORK } from "../constants/amm";

// export const devnetOptions: RpcProviderOptions = {};

export const testnetOptions: RpcProviderOptions = {
  nodeUrl: "https://api.carmine.finance/api/v1/testnet/call",
  chainId: constants.StarknetChainId.SN_GOERLI,
};

export const mainnetOptions: RpcProviderOptions = {
  nodeUrl: "https://api.carmine.finance/api/v1/mainnet/call",
  chainId: constants.StarknetChainId.SN_GOERLI,
};

export const providerOptions = (): RpcProviderOptions => {
  if (NETWORK === "mainnet") {
    return mainnetOptions;
  } else if (NETWORK === "testnet") {
    return testnetOptions;
    // } else if (NETWORK === "devnet") {
    //   return devnetOptions;
  } else {
    throw new Error(`Invalid network provided! ${NETWORK}`);
  }
};

export const provider = new RpcProvider(providerOptions());

export const getNetworkObject = (): Network => {
  if (NETWORK === "mainnet") {
    return {
      name: NetworkName.Mainnet,
      chainId: constants.StarknetChainId.SN_MAIN,
    };
  } else if (NETWORK === "testnet") {
    return {
      name: NetworkName.Testnet,
      chainId: constants.StarknetChainId.SN_GOERLI,
    };
  } else if (NETWORK === "devnet") {
    return {
      name: NetworkName.Testnet,
      chainId: constants.StarknetChainId.SN_GOERLI,
    };
  } else {
    throw new Error(`Invalid network provided! ${NETWORK}`);
  }
};

export const networkObject = getNetworkObject();
