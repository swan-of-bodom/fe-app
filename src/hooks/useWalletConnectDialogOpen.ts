import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useWalletConnectDialogOpen = (): boolean =>
  useSelector((s: RootState) => s.network.walletConnectDialogOpen);
