import { ProviderInterface } from "starknet";
import { Provider } from "starknet";
import {
  devProviderOptions,
  testnet2ProviderOptions,
} from "../constants/environment";
import { Envs } from "../redux/reducers/environment";

const networkKey = "starknet-network";

export const storeUsedNetwork = (network: Envs): void => {
  localStorage.setItem(networkKey, network);
};

/**
 * Retrieves which network was last set from localStorage.
 * Testnet is used as fallback.
 */
export const getUsedNetwork = (): Envs => {
  const network = localStorage.getItem(networkKey);
  const fallback = Envs.Testnet2;
  return Object.values(Envs).includes(network as Envs)
    ? (network as Envs)
    : fallback;
};

export const getProvider = (): ProviderInterface | undefined => {
  const network = getUsedNetwork();
  switch (network) {
    case Envs.Devnet:
      return new Provider(devProviderOptions);

    case Envs.Testnet:
      // no options for testnet
      return new Provider();

    case Envs.Testnet2:
      // no options for testnet
      return new Provider(testnet2ProviderOptions);

    case Envs.Mainnet:
      // TODO: add mainnet options
      return new Provider();

    default:
      // when in doubt, use testnet
      return new Provider();
  }
};
