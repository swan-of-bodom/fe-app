import { Typography } from "@mui/material";
import { useEffect } from "react";
import { PoolBalance } from "../components/poolBalance";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Pool Balance</Typography>
      <p>Check the current lockable capital in the pool.</p>
      <PoolBalance />
    </>
  );
};

export default Balance;
