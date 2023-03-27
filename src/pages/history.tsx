import { useEffect } from "react";
import { Typography } from "@mui/material";
import { TradeHistory } from "../components/TradeHistory/TradeHistory";

const HistoryPage = () => {
  useEffect(() => {
    document.title = "History | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">History</Typography>
      <TradeHistory />
    </>
  );
};

export default HistoryPage;
