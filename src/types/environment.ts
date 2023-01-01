import { ThemeVariants } from "../style/themes";

export const enum ProviderVariants {
  Devnet,
  Testnet,
  Mainnet,
}

export interface Settings {
  autoconnect: boolean;
  theme: ThemeVariants;
}
