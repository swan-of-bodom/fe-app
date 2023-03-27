import { useEffect } from "react";
import { Tooltip, Typography } from "@mui/material";
import StakeCapital from "../components/StakeCapital";
import WithdrawCapital from "../components/WithdrawCapital";
import { Link as RouterLink } from "react-router-dom";
import { Info } from "@mui/icons-material";

const StakePage = () => {
  useEffect(() => {
    document.title = "Stake Capital | Carmine Finance";
  });

  return (
    <>
      <Tooltip title="Click to learn more">
        <RouterLink
          style={{ textDecoration: "none", color: "inherit" }}
          to="/staking-explained"
        >
          <Typography variant="h4" sx={{ mb: 2, display: "inline" }}>
            Stake Capital <Info />
          </Typography>
        </RouterLink>
      </Tooltip>
      <StakeCapital />
      <Typography variant="h4">Withdraw Capital</Typography>
      <WithdrawCapital />
    </>
  );
};

export default StakePage;
