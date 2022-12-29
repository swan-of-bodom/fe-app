import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./components/layout";

// Starknet
import { InjectedConnector } from "@starknet-react/core";
import { SupportedWalletIds } from "./types/wallet";

// Redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Pages
import BalancePage from "./pages/balance";
import NotFound from "./pages/notFound";
import TradePage from "./pages/trade";
import { StarknetConfig } from "@starknet-react/core";
import { getProvider } from "./utils/environment";
import StakePage from "./pages/stake";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ThemeVariants, getInitialTheme, getTheme } from "./style/themes";
import StakingExplainedPage from "./pages/stakeInfo";
import { useMemo, useState } from "react";

const App = () => {
  const connectors = Object.values(SupportedWalletIds).map(
    (id) => new InjectedConnector({ options: { id } })
  );

  const [mode, toggleMode] = useState<ThemeVariants>(getInitialTheme());
  const theme = useMemo(() => getTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <StarknetConfig
          defaultProvider={getProvider()}
          connectors={connectors}
          autoConnect={false}
        >
          <Router>
            <Layout mode={mode} toggleMode={toggleMode}>
              <Routes>
                <Route path="/" element={<TradePage />} />
                <Route path="/trade" element={<TradePage />} />
                <Route path="/position" element={<BalancePage />} />
                <Route path="/staking" element={<StakePage />} />
                <Route
                  path="/staking-explained"
                  element={<StakingExplainedPage />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </StarknetConfig>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
