import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Portfolio from "./pages/portfolio";
import NotFound from "./pages/notFound";
import TradePage from "./pages/trade";
import StakePage from "./pages/stake";
import StakingExplainedPage from "./pages/stakeInfo";
import Settings from "./pages/settings";
import { Controller } from "./Controller";
import { CssBaseline } from "@mui/material";
import { MultiDialog } from "./components/MultiDialog/MultiDialog";
import { Toast } from "./components/Toast/Toast";
import TermsAndConditions from "./pages/termsAndConditions";
import { useState } from "react";
import { AlphaRibbon } from "./components/AlphaRibbon/AlphaRibbon";
import { isCookieSet } from "./utils/cookies";
import APYInfoPage from "./pages/apyInfo";
import TradeDashboardPage from "./pages/dashboard";
import Insurance from "./pages/insurance";
import "./style/base.css";

const App = () => {
  const [check, rerender] = useState(false);

  const acceptedTermsAndConditions = isCookieSet("carmine-t&c");

  const oldPathRedirects = [
    ["/trade", "/"],
    ["/position", "/portfolio"],
    ["/history", "/portfolio#history"],
  ];

  return (
    <Provider store={store}>
      <Controller>
        <CssBaseline />
        {acceptedTermsAndConditions ? (
          <>
            <Router>
              <Routes>
                {/* paths that no longer exist are redirected to new paths */}
                {oldPathRedirects.map(([oldPath, newPath], i) => (
                  <Route
                    key={i}
                    path={oldPath}
                    element={<Navigate to={newPath} replace />}
                  />
                ))}

                <Route path="/" element={<TradePage />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/staking" element={<StakePage />} />
                <Route
                  path="/staking-explained"
                  element={<StakingExplainedPage />}
                />
                <Route path="/apy-info" element={<APYInfoPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/dashboard" element={<TradeDashboardPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <MultiDialog />
            <Toast />
            <AlphaRibbon />
          </>
        ) : (
          <TermsAndConditions check={check} rerender={rerender} />
        )}
      </Controller>
    </Provider>
  );
};

export default App;
