import { Provider, ProviderOptions, RpcProviderOptions } from "starknet";
import { Network, NetworkName } from "../types/network";
import { constants } from "starknet";
import { NETWORK } from "../constants/amm";

import { Chain, goerli, mainnet } from "@starknet-react/chains";

export const devnetOptions = {
  sequencer: {
    baseUrl: "http://localhost:5050/",
    feederGatewayUrl: "feeder_gateway",
    gatewayUrl: "http://localhost:5050/",
    chainId: constants.StarknetChainId.SN_MAIN,
  },
};

export const testnetOptions: ProviderOptions = {
  rpc: {
    nodeUrl: "https://api.carmine.finance/api/v1/testnet/call",
    chainId: constants.StarknetChainId.SN_GOERLI,
  },
};

export const mainnetOptions: ProviderOptions = {
  rpc: {
    nodeUrl: "https://api.carmine.finance/api/v1/mainnet/call",
    chainId: constants.StarknetChainId.SN_GOERLI,
  },
};

export const jsonProviderOptions = (chain: Chain): RpcProviderOptions => {
  if (chain.id === goerli.id) {
    return {
      nodeUrl: "https://api.carmine.finance/api/v1/testnet/call",
      chainId: constants.StarknetChainId.SN_GOERLI,
    };
  }
  if (chain.id === mainnet.id) {
    return {
      nodeUrl: "https://api.carmine.finance/api/v1/mainnet/call",
      chainId: constants.StarknetChainId.SN_GOERLI,
    };
  }
  // unreachable
  throw Error("Invalid network");
};

export const providerOptions = (): ProviderOptions => {
  if (NETWORK === "mainnet") {
    return mainnetOptions;
  } else if (NETWORK === "testnet") {
    return testnetOptions;
  } else if (NETWORK === "devnet") {
    return devnetOptions;
  } else {
    throw new Error(`Invalid network provided! ${NETWORK}`);
  }
};

export const provider = new Provider(providerOptions());

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
