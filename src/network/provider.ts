import { Provider, ProviderOptions } from "starknet";
import { Network, NetworkName } from "../types/network";
import { constants } from "starknet";
import { NETWORK } from "../constants/amm";

export const devnetOptions = {
  sequencer: {
    baseUrl: "http://localhost:5050/",
    feederGatewayUrl: "feeder_gateway",
    gatewayUrl: "http://localhost:5050/",
    chainId: constants.StarknetChainId.MAINNET,
  },
};

export const testnetOptions: ProviderOptions = {
  sequencer: {
    network: "goerli-alpha",
  },
};

export const mainnetOptions: ProviderOptions = {
  sequencer: {
    network: "mainnet-alpha",
  },
};

export const providerOptions = (): ProviderOptions => {
  if (NETWORK === "mainnet") {
    return mainnetOptions;
  } else if (NETWORK === "testnet") {
    return mainnetOptions;
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
      chainId: constants.StarknetChainId.MAINNET,
    };
  } else if (NETWORK === "testnet") {
    return {
      name: NetworkName.Testnet,
      chainId: constants.StarknetChainId.TESTNET,
    };
  } else if (NETWORK === "devnet") {
    return {
      name: NetworkName.Testnet,
      chainId: constants.StarknetChainId.TESTNET,
    };
  } else {
    throw new Error(`Invalid network provided! ${NETWORK}`);
  }
};

export const networkObject = getNetworkObject();
