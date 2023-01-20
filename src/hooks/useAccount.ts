import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { AccountInterface } from "starknet";

export const useAccount = (): AccountInterface | undefined =>
  useSelector((s: RootState) => s.network.wallet?.account);
