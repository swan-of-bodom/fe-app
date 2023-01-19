import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import BalancePage from "./pages/balance";
import NotFound from "./pages/notFound";
import TradePage from "./pages/trade";
import StakePage from "./pages/stake";
import StakingExplainedPage from "./pages/stakeInfo";
import Settings from "./pages/settings";
import { Controller } from "./Controller";
import { CssBaseline } from "@mui/material";

const App = () => (
  <Provider store={store}>
    <Controller>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TradePage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/position" element={<BalancePage />} />
            <Route path="/staking" element={<StakePage />} />
            <Route
              path="/staking-explained"
              element={<StakingExplainedPage />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </Controller>
  </Provider>
);

export default App;
