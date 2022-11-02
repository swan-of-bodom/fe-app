import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./components/layout";

// Starknet
import { InjectedConnector } from "@starknet-react/core";
import { SupportedWalletIds } from "./types/wallet";

// Redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Pages
import Home from "./pages/home";
import BalancePage from "./pages/balance";
import NotFound from "./pages/notFound";
import BuyPage from "./pages/buy";
import { Controller } from "./components/controller";
import { StarknetConfig } from "@starknet-react/core";
import { getProvider } from "./utils/environment";

const App = () => {
  const connectors = Object.values(SupportedWalletIds).map(
    (id) => new InjectedConnector({ options: { id } })
  );

  console.log(process.env);

  return (
    <Provider store={store}>
      <StarknetConfig
        defaultProvider={getProvider()}
        connectors={connectors}
        autoConnect={true}
      >
        <Controller />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sell" element={<BalancePage />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </StarknetConfig>
    </Provider>
  );
};

export default App;
