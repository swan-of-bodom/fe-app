import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  getInstalledInjectedConnectors,
  StarknetProvider,
} from "@starknet-react/core";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Sign from "./pages/sign";
import TokenPage from "./pages/token";
import BalancePage from "./pages/balance";

const App = () => {
  const connectors = getInstalledInjectedConnectors();

  return (
    <StarknetProvider connectors={connectors} autoConnect>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/token" element={<TokenPage />} />
            <Route path="/balance" element={<BalancePage />} />
          </Routes>
        </Layout>
      </Router>
    </StarknetProvider>
  );
};

export default App;
