import { setSlippageState, updateSettingsState } from "./reducers/settings";
import { updateNetworkState } from "./reducers/network";
import {
  DialogContentElem,
  setCloseOptionState,
  setToastState,
  ToastType,
  toggleDialog,
} from "./reducers/ui";
import { store } from "./store";
import { Settings } from "../types/settings";
import { NetworkState } from "../types/network";
import { OptionWithPosition } from "../types/options";
import {
  addTxReducer,
  setTxStatusReducer,
  Transaction,
  TransactionActions,
  TransactionStatus,
} from "./reducers/transactions";

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

export const openCloseOptionDialog = () =>
  openDialogWithContent(DialogContentElem.CloseOption);

export const openAccountDialog = () =>
  openDialogWithContent(DialogContentElem.Account);

export const setSlippage = (n: number) => store.dispatch(setSlippageState(n));

export const setCloseOption = (option: OptionWithPosition) =>
  store.dispatch(setCloseOptionState(option));

export const showToast = (message: string, type: ToastType = ToastType.Info) =>
  store.dispatch(setToastState({ message, open: true, type }));

export const hideToast = () => store.dispatch(setToastState({ open: false }));

export const addTx = (hash: string, action: TransactionActions) => {
  const tx: Transaction = {
    hash,
    action,
    status: TransactionStatus.Pending,
    timestamp: new Date().getTime(),
    chainId: store.getState().network.network.chainId,
  };
  store.dispatch(addTxReducer(tx));
};

export const markTxAsDone = (hash: string) =>
  store.dispatch(
    setTxStatusReducer({ hash, status: TransactionStatus.Success })
  );

export const markTxAsFailed = (hash: string) =>
  store.dispatch(
    setTxStatusReducer({ hash, status: TransactionStatus.Failed })
  );
