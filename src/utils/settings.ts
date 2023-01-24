import { ThemeVariants } from "../style/themes";
import { NetworkName } from "../types/network";
import { Settings } from "../types/settings";
import { debug } from "./debugger";

const SETTINGS_KEY = "app-settings";

const DEFAULT_SETTINGS: Settings = {
  autoconnect: true,
  theme: ThemeVariants.dark,
  network: NetworkName.Testnet,
};

export const validateSettings = (v: unknown): v is Settings => {
  if (
    !v ||
    !Object.hasOwn(v, "autoconnect") ||
    !Object.hasOwn(v, "theme") ||
    !Object.hasOwn(v, "network")
  ) {
    return false;
  }

  if (
    !Object.values(ThemeVariants).includes((v as Settings).theme) ||
    !Object.values(NetworkName).includes((v as Settings).network)
  ) {
    return false;
  }

  return true;
};

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
    return DEFAULT_SETTINGS;
  }
  try {
    const v: unknown = JSON.parse(s);
    if (validateSettings(v)) {
      return v;
    }
    return DEFAULT_SETTINGS;
  } catch (e: any) {
    debug("Failed to retrieve settings", e?.message);
    return DEFAULT_SETTINGS;
  }
};
