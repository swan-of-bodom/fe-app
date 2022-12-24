import { useEffect } from "react";
import { Typography } from "@mui/material";
import TradeTable from "../components/TradeTable";
import { ComplexGraph } from "../components/CryptoGraph/TradingView";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Buy Options</Typography>
      <ComplexGraph />
      <TradeTable />
    </>
  );
};

export default TradePage;
