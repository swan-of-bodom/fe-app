import { useEffect } from "react";

import { AlternativeTradingView } from "../components/CryptoGraph/AlternativeTradingView";
import { Layout } from "../components/layout";
import TradeTable from "../components/TradeTable";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <Layout>
      <div style={{ width: "100%", height: "500px" }}>
        <AlternativeTradingView />
      </div>
      <TradeTable />
    </Layout>
  );
};

export default TradePage;
