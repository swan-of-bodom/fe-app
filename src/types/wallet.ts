import BN from "bn.js";

export enum SupportedWalletIds {
  ArgentX = "argentX",
  Braavos = "braavos",
}

export type UserBalance = {
  eth: BN;
  usd: BN;
};
