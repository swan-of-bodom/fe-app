import { useEffect } from "react";
import TradeTable from "../components/TradeTable";
import { Layout } from "../components/layout";
import { AlternativeTradingView } from "../components/CryptoGraph/AlternativeTradingView";
import { isMainnet } from "../constants/amm";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <Layout>
      {isMainnet && (
        <div>
          <p>
            Welcome to the new AMM App, the old App is still running at{" "}
            <a href="https://legacy.app.carmine.finance">
              legacy.app.carmine.finance
            </a>
            .
          </p>
        </div>
      )}

      <div style={{ width: "100%", height: "500px" }}>
        <AlternativeTradingView />
      </div>
      <TradeTable />
    </Layout>
  );
};

export default TradePage;
