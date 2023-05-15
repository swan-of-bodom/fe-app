import { MetaMaskInpageProvider } from "@metamask/providers";
import BN from "bn.js";

export enum SupportedWalletIds {
  ArgentX = "argentX",
  Braavos = "braavos",
}

export type UserBalance = {
  eth: BN;
  usd: BN;
};

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
