import { useEffect } from "react";
import TradeTable from "../components/TradeTable";
import { Layout } from "../components/layout";
import { AlternativeTradingView } from "../components/CryptoGraph/AlternativeTradingView";

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
