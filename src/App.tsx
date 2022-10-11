import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./components/layout";

// Starknet
import { InjectedConnector, StarknetProvider } from "@starknet-react/core";
import { SupportedWalletIds } from "./types/wallet.d";

// Redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Pages
import Home from "./pages/home";
import Sign from "./pages/sign";
import TokenPage from "./pages/token";
import BalancePage from "./pages/balance";
import NotFound from "./pages/notFound";
import Options from "./pages/options";
import BuyPage from "./pages/buy";

const App = () => {
  const connectors = Object.values(SupportedWalletIds).map(
    (id) => new InjectedConnector({ options: { id } })
  );

  return (
    <Provider store={store}>
      <StarknetProvider connectors={connectors} autoConnect>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign" element={<Sign />} />
              <Route path="/token" element={<TokenPage />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="/options" element={<Options />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </StarknetProvider>
    </Provider>
  );
};

export default App;
