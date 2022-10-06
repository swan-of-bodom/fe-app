import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InjectedConnector, StarknetProvider } from "@starknet-react/core";
import { SupportedWalletIds } from "./types/wallet.d";
import { Layout } from "./components/layout";
import Home from "./pages/home";
import Sign from "./pages/sign";
import TokenPage from "./pages/token";
import BalancePage from "./pages/balance";
import NotFound from "./pages/notFound";

const App = () => {
  const connectors = Object.values(SupportedWalletIds).map(
    (id) => new InjectedConnector({ options: { id } })
  );

  return (
    <StarknetProvider connectors={connectors} autoConnect>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/token" element={<TokenPage />} />
            <Route path="/balance" element={<BalancePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </StarknetProvider>
  );
};

export default App;
