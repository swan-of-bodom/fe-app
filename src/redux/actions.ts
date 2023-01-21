import { updateSettingsState } from "./reducers/settings";
import { updateNetworkState } from "./reducers/network";
import { store } from "./store";
import { Settings } from "../types/settings";
import { NetworkState } from "../types/network";

export const updateSettings = (v: Partial<Settings>) =>
  store.dispatch(updateSettingsState(v));

export const updateNetwork = (v: Partial<NetworkState>) =>
  store.dispatch(updateNetworkState(v));

const toggleNetworkMismatchDialog = (open: boolean) =>
  store.dispatch(updateNetworkState({ networkMismatchDialogOpen: open }));

export const openNetworkMismatchDialog = () =>
  toggleNetworkMismatchDialog(true);

export const closeNetworkMismatchDialog = () =>
  toggleNetworkMismatchDialog(false);
