import { ProviderInterface } from "starknet";
import { Provider } from "starknet";
import { defaultSettings, devProviderOptions } from "../constants/environment";
import { Envs } from "../redux/reducers/environment";
import { Settings } from "../types/environment";
import { debug } from "./debugger";

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
  const fallback = Envs.Testnet;
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
      return new Provider({
        sequencer: {
          network: "goerli-alpha",
        },
      });

    case Envs.Testnet2:
      // no options for testnet
      return new Provider({
        sequencer: {
          network: "goerli-alpha-2",
        },
      });

    case Envs.Testdev:
      // no options for testnet
      return new Provider({
        sequencer: {
          network: "goerli-alpha",
        },
      });

    case Envs.Mainnet:
      // TODO: add mainnet options
      return new Provider();

    default:
      // when in doubt, use testnet
      return new Provider();
  }
};

const SETTINGS_KEY = "app-settings";

export const storeSetting = (s: Settings) => {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch (error) {
    debug("Failed to store setting to local storage");
    console.error(error);
  }
};

export const retrieveSettings = (): Settings => {
  const s = window.localStorage.getItem(SETTINGS_KEY);
  if (!s) {
    return defaultSettings;
  }
  try {
    return JSON.parse(s) as Settings;
  } catch (e: any) {
    debug("Failed to retrieve settings", e?.message);
    return defaultSettings;
  }
};
