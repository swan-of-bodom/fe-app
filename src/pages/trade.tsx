import { useEffect } from "react";
import { Typography } from "@mui/material";
import TradeTable from "../components/TradeTable";
import { ComplexGraph } from "../components/CryptoGraph/TradingView";
import { ClaimButton } from "../components/ClaimButton/ClaimButton";

const TradePage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h4">
        Buy Options
      </Typography>
      <ComplexGraph />
      <TradeTable />
      <Typography sx={{ mb: 2, mt: 5 }} variant="h4">
        Airdrop
      </Typography>
      <Typography>
        If you are eligible for tokens airdrop, claim it here
      </Typography>
      <ClaimButton />
    </>
  );
};

export default TradePage;
