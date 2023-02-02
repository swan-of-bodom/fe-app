import { ThemeVariants } from "../style/themes";
import { NetworkName } from "./network";

export interface Settings {
  autoconnect: boolean;
  theme: ThemeVariants;
  network: NetworkName;
  slippage: number;
}
