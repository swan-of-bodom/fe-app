import { setSlippageState, updateSettingsState } from "./reducers/settings";
import { updateNetworkState } from "./reducers/network";
import { DialogContentElem, toggleDialog } from "./reducers/ui";
import { store } from "./store";
import { Settings } from "../types/settings";
import { NetworkState } from "../types/network";

export const updateSettings = (v: Partial<Settings>) =>
  store.dispatch(updateSettingsState(v));

export const updateNetwork = (v: Partial<NetworkState>) =>
  store.dispatch(updateNetworkState(v));

export const closeDialog = () =>
  store.dispatch(
    toggleDialog({
      dialogOpen: false,
    })
  );

const openDialogWithContent = (content: DialogContentElem) =>
  store.dispatch(
    toggleDialog({
      dialogOpen: true,
      dialogContent: content,
    })
  );

export const openNetworkMismatchDialog = () =>
  openDialogWithContent(DialogContentElem.NetworkMismatch);

export const openWalletConnectDialog = () =>
  openDialogWithContent(DialogContentElem.Wallet);

export const openSlippageDialog = () =>
  openDialogWithContent(DialogContentElem.Slippage);

export const setSlippage = (n: number) => store.dispatch(setSlippageState(n));
