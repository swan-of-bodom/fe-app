import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ConnectedStarknetWindowObject } from "get-starknet-core";

export const useWallet = (): ConnectedStarknetWindowObject | undefined =>
  useSelector((s: RootState) => s.network.wallet);
