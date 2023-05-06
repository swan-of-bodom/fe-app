import { useEffect } from "react";
import { Positions } from "../components/PositionTable";
import { Typography } from "@mui/material";
import { ClaimButton } from "../components/ClaimButton/ClaimButton";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });

  return (
    <>
      <Positions />
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

export default Balance;
