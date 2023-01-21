import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useNetworkMismatchDialogOpen = (): boolean =>
  useSelector((s: RootState) => s.network.networkMismatchDialogOpen);
