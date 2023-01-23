import {
  NetworkChangeEventHandler,
  StarknetWindowObject,
} from "get-starknet-core";
import { store } from "../redux/store";
import { NetworkName } from "../types/network";
import { openNetworkMismatchDialog } from "../redux/actions";

export const walletNetworkChangeHandler: NetworkChangeEventHandler = (e) => {
  const isWalletMainnet = e === "SN_MAIN" || e === "mainnet-alpha";
  const isAppMainnet =
    store.getState().settings.network === NetworkName.Mainnet;

  if (isWalletMainnet === isAppMainnet) {
    // all is well, do nothing
    return;
  }

  // network mismatch - open the dialog
  openNetworkMismatchDialog();
};

type EventList = {
  event: string;
  walletId: string;
};

const eventList: EventList[] = [];

export const addWalletEventHandlers = (wallet: StarknetWindowObject) => {
  if (
    eventList.some(
      (eventObj) =>
        eventObj.event === "networkChanged" && eventObj.walletId === wallet.id
    )
  ) {
    // this event listener is already added - do nothing
    return;
  }
  wallet.on("networkChanged", walletNetworkChangeHandler);
  eventList.push({
    event: "networkChanged",
    walletId: wallet.id,
  });
};
