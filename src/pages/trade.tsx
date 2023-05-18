import { useEffect } from "react";
import { Typography } from "@mui/material";
import TradeTable from "../components/TradeTable";
import { ComplexGraph } from "../components/CryptoGraph/TradingView";
import { Layout } from "../components/layout";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <Layout>
      <Typography sx={{ mb: 2 }} variant="h4">
        Buy Options
      </Typography>
      <ComplexGraph />
      <TradeTable />
    </Layout>
  );
};

export default TradePage;
