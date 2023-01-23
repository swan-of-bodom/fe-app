import {
  closeWalletConnectDialog,
  openNetworkMismatchDialog,
  updateNetwork,
} from "../redux/actions";
import {
  StarknetWindowObject,
  getStarknet,
  ConnectedStarknetWindowObject,
} from "get-starknet-core";
import { debug } from "../utils/debugger";
import { store } from "../redux/store";
import { SupportedWalletIds } from "../types/wallet";
import { addWalletEventHandlers } from "./walletEvents";

const isConnectedWallet = (
  wallet: StarknetWindowObject | undefined
): wallet is ConnectedStarknetWindowObject => {
  if (wallet && wallet.isConnected && wallet.account) {
    return true;
  }

  return false;
};

export const getWallet = (): ConnectedStarknetWindowObject | undefined => {
  const { walletId } = store.getState().network;

  if (!walletId) {
    return undefined;
  }

  const wallet =
    walletId === SupportedWalletIds.ArgentX
      ? window.starknet_argentX
      : window.starknet_braavos;

  if (isConnectedWallet(wallet)) {
    return wallet;
  }
  return undefined;
};

export const disconnect = () => {
  const sn = getStarknet();
  sn.disconnect().then((res) => {
    updateNetwork({ walletId: undefined });
    debug("Wallet disconnected");
  });
};

export const connect = (wallet: StarknetWindowObject) => {
  const sn = getStarknet();
  sn.enable(wallet).then(() => {
    if (!isConnectedWallet(wallet)) {
      return;
    }
    updateNetwork({ walletId: wallet.id as SupportedWalletIds });
    debug("Wallet connected", wallet);

    const { chainId } = store.getState().network.network;

    if (chainId !== wallet.account.chainId) {
      debug("Wallet - App network mismatch, opening dialog");
      disconnect();
      closeWalletConnectDialog();
      openNetworkMismatchDialog();
      return;
    }

    addWalletEventHandlers(wallet);
  });
};

export const connectToLatest = async () => {
  const { walletId } = store.getState().network;

  if (walletId) {
    // already connected
    return;
  }

  const sn = getStarknet();
  const latestWallet = await sn.getLastConnectedWallet();

  debug("Latest wallet", latestWallet);

  if (latestWallet) {
    return connect(latestWallet);
  }
};
