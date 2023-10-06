import { useEffect } from "react";
import TradeTable from "../components/TradeTable";
import { ComplexGraph } from "../components/CryptoGraph/TradingView";
import { Layout } from "../components/layout";
import { AlternativeTradingView } from "../components/CryptoGraph/AlternativeTradingView";
// import { Vote } from "../components/Vote/Vote";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  const showAlternativeGraph = window.location.search.includes("altgraph");

  return (
    <Layout>
      {/* 
      Uncomment this to show voting
      <Typography sx={{ mb: 2 }} variant="h4">
        Vote on proposal 14
      </Typography>
      <Vote /> */}
      {showAlternativeGraph ? (
        <div style={{ width: "100%", height: "500px" }}>
          <AlternativeTradingView />
        </div>
      ) : (
        <ComplexGraph />
      )}
      <TradeTable />
    </Layout>
  );
};

export default TradePage;
