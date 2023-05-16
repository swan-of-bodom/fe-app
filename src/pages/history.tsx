import { useEffect } from "react";
import { Typography } from "@mui/material";
import { TradeHistory } from "../components/TradeHistory/TradeHistory";
import { Layout } from "../components/layout";

const HistoryPage = () => {
  useEffect(() => {
    document.title = "History | Carmine Finance";
  });

  return (
    <Layout>
      <Typography sx={{ mb: 2 }} variant="h4">
        History
      </Typography>
      <Typography>
        Please be advised that it takes 5-20 minutes for a transaction to
        appear.
      </Typography>
      <TradeHistory />
    </Layout>
  );
};

export default HistoryPage;
