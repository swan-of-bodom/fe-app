import { useEffect } from "react";
import { Typography } from "@mui/material";
import TradeTable from "../components/TradeTable";
import CryptoGraph from "../components/CryptoGraph";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Buy Options</Typography>
      <CryptoGraph />
      <TradeTable />
    </>
  );
};

export default TradePage;
