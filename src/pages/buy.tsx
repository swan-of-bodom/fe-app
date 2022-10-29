import { useEffect } from "react";
import { Typography } from "@mui/material";
import TradeTable from "../components/TradeTable";
import BasicGraph from "../components/BasicGraph";

const BuyPage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Buy Options</Typography>
      <BasicGraph />
      <TradeTable />
    </>
  );
};

export default BuyPage;
