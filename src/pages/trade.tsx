import { useEffect } from "react";
import { Typography } from "@mui/material";
import TradeTable from "../components/TradeTable";
import CryptoGraph from "../components/CryptoGraph";
import { ComplexGraph } from "../components/CryptoGraph/TradingView";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Buy Options</Typography>
      {/* <CryptoGraph /> */}
      <ComplexGraph />
      <TradeTable />
    </>
  );
};

export default TradePage;
