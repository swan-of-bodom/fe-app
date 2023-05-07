import { Provider, ProviderOptions } from "starknet";
import { Network, NetworkName } from "../types/network";
import { constants } from "starknet";

const devnetOptions = {
  sequencer: {
    baseUrl: "http://127.0.0.1:5050/",
    feederGatewayUrl: "feeder_gateway",
    gatewayUrl: "http://127.0.0.1:5050/",
    chainId: constants.StarknetChainId.MAINNET,
  },
};

const testnetOptions: ProviderOptions = {
  sequencer: {
    network: "goerli-alpha",
  },
};

export const networkProviderOptionsMap = new Map<NetworkName, ProviderOptions>([
  [NetworkName.Devnet, devnetOptions],
  [NetworkName.Testnet, testnetOptions],
  [NetworkName.Testdev, testnetOptions],
  [
    NetworkName.Mainnet,
    {
      sequencer: {
        network: "mainnet-alpha",
      },
    },
  ],
]);

export const getProviderByNetwork = (network: NetworkName): Provider =>
  new Provider(networkProviderOptionsMap.get(network) as ProviderOptions); // Map must be exhaustive!

export const getNetworkObjectByNetworkName = (name: NetworkName): Network => {
  // Testnet, Testdev and Devnet use Testnet chainId
  const chainId =
    name === NetworkName.Mainnet
      ? constants.StarknetChainId.MAINNET
      : constants.StarknetChainId.TESTNET;

  return {
    name,
    chainId,
  };
};
