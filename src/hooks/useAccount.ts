import { AccountInterface } from "starknet";
import { useWallet } from "./useWallet";

export const useAccount = (): AccountInterface | undefined =>
  useWallet()?.account;
