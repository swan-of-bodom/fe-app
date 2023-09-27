import { MetaMaskInpageProvider } from "@metamask/providers";
import { TokenKey } from "../tokens/tokens";

export enum SupportedWalletIds {
  ArgentX = "argentX",
  Braavos = "braavos",
}

export type UserBalance = {
  [key in TokenKey]: bigint;
};

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
