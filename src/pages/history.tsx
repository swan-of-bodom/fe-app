import { useEffect } from "react";
import { Typography } from "@mui/material";
import { TradeHistory } from "../components/TradeHistory/TradeHistory";

const HistoryPage = () => {
  useEffect(() => {
    document.title = "History | Carmine Finance";
  });

  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h4">
        History
      </Typography>
      <Typography>
        Please be advised that it takes 5-20 minutes for a transaction to
        appear.
      </Typography>
      <TradeHistory />
    </>
  );
};

export default HistoryPage;
