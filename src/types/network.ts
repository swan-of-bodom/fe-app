import { ConnectedStarknetWindowObject } from "get-starknet-core";
import { Provider } from "starknet";

export enum NetworkName {
  Testnet = "Testnet",
  Devnet = "Devnet",
  Mainnet = "Mainnet",
  Testdev = "Testdev",
}

export interface Network {
  name: NetworkName;
}

export interface NetworkState {
  wallet?: ConnectedStarknetWindowObject;
  provider: Provider;
  network: Network;
}
