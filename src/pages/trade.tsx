import { useEffect } from "react";
import TradeTable from "../components/TradeTable";
import { ComplexGraph } from "../components/CryptoGraph/TradingView";
import { Layout } from "../components/layout";
// import { Vote } from "../components/Vote/Vote";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <Layout>
      {/* 
      Uncomment this to show voting
      <Typography sx={{ mb: 2 }} variant="h4">
        Vote on proposal 14
      </Typography>
      <Vote /> */}
      <ComplexGraph />
      <TradeTable />
    </Layout>
  );
};

export default TradePage;
