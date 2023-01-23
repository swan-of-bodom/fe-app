import { updateSettingsState } from "./reducers/settings";
import { updateNetworkState } from "./reducers/network";
import { store } from "./store";
import { Settings } from "../types/settings";
import { NetworkState } from "../types/network";
import { toggleNetworkMismatch, toggleWalletConnect } from "./reducers/ui";

export const updateSettings = (v: Partial<Settings>) =>
  store.dispatch(updateSettingsState(v));

export const updateNetwork = (v: Partial<NetworkState>) =>
  store.dispatch(updateNetworkState(v));

const toggleNetworkMismatchDialog = (open: boolean) =>
  store.dispatch(toggleNetworkMismatch(open));

export const openNetworkMismatchDialog = () =>
  toggleNetworkMismatchDialog(true);

export const closeNetworkMismatchDialog = () =>
  toggleNetworkMismatchDialog(false);

const toggleWalletConnectDialog = (open: boolean) =>
  store.dispatch(toggleWalletConnect(open));

export const openWalletConnectDialog = () => toggleWalletConnectDialog(true);

export const closeWalletConnectDialog = () => toggleWalletConnectDialog(false);
