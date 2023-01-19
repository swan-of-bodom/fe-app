import { InjectedConnector } from "@starknet-react/core";
import { SupportedWalletIds } from "./types/wallet";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { StarknetConfig } from "@starknet-react/core";
import { ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./queries/client";
import { ReactNode, useMemo } from "react";
import { getTheme } from "./style/themes";

type Props = { children: ReactNode };

export const Controller = ({ children }: Props) => {
  const connectors = Object.values(SupportedWalletIds).map(
    (id) => new InjectedConnector({ options: { id } })
  );
  const { settings, network } = useSelector((s: RootState) => s);
  const theme = useMemo(() => getTheme(settings.theme), [settings.theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StarknetConfig
          defaultProvider={network.provider}
          connectors={connectors}
          autoConnect={settings.autoconnect}
        >
          {children}
        </StarknetConfig>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
