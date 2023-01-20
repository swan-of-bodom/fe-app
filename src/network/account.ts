import { updateNetwork } from "../redux/actions";
import {
  StarknetWindowObject,
  getStarknet,
  ConnectedStarknetWindowObject,
} from "get-starknet-core";
import { debug } from "../utils/debugger";

const isConnectedWallet = (
  wallet: StarknetWindowObject
): wallet is ConnectedStarknetWindowObject => {
  if (wallet && wallet.isConnected && wallet.account) {
    return true;
  }

  return false;
};

export const connect = (wallet: StarknetWindowObject) =>
  wallet.enable().then(() => {
    if (isConnectedWallet(wallet)) {
      updateNetwork({ wallet });
      debug("Wallet connected", wallet);
    }
  });

export const disconnect = () => {
  const sn = getStarknet();
  sn.disconnect().then((res) => {
    updateNetwork({ wallet: undefined });
    debug("Wallet disconnected");
  });
};
