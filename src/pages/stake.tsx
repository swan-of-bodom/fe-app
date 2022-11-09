import { useEffect } from "react";
import { Typography } from "@mui/material";
import StakeCapital from "../components/StakeCapital";
import { WithdrawCapital } from "../components/WithdrawCapital";

const StakePage = () => {
  useEffect(() => {
    document.title = "Stake Capital | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Stake Capital</Typography>
      <StakeCapital />
      <WithdrawCapital />
    </>
  );
};

export default StakePage;
