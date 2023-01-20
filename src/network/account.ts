import { updateNetwork } from "../redux/actions";
import {
  StarknetWindowObject,
  getStarknet,
  ConnectedStarknetWindowObject,
} from "get-starknet-core";
import { debug } from "../utils/debugger";
import { store } from "../redux/store";

const isConnectedWallet = (
  wallet: StarknetWindowObject
): wallet is ConnectedStarknetWindowObject => {
  if (wallet && wallet.isConnected && wallet.account) {
    return true;
  }

  return false;
};

export const connect = (wallet: StarknetWindowObject) => {
  const sn = getStarknet();
  sn.enable(wallet).then(() => {
    if (isConnectedWallet(wallet)) {
      updateNetwork({ wallet });
      debug("Wallet connected", wallet);
    }
  });
};

export const disconnect = () => {
  const sn = getStarknet();
  sn.disconnect().then((res) => {
    updateNetwork({ wallet: undefined });
    debug("Wallet disconnected");
  });
};

export const connectToLatest = async () => {
  const { wallet } = store.getState().network;

  if (wallet) {
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
