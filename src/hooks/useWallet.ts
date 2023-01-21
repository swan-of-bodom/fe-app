import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ConnectedStarknetWindowObject } from "get-starknet-core";
import { getWallet } from "../network/account";

export const useWallet = (): ConnectedStarknetWindowObject | undefined => {
  const id = useSelector((s: RootState) => s.network.walletId);

  if (!id) {
    return undefined;
  }

  return getWallet();
};
