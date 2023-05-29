import { MetaMaskInpageProvider } from "@metamask/providers";
import BN from "bn.js";
import { TokenKey } from "../tokens/tokens";

export enum SupportedWalletIds {
  ArgentX = "argentX",
  Braavos = "braavos",
}

export type UserBalance = {
  [key in TokenKey]: BN;
};

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
