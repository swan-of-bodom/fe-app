import { useEffect } from "react";
import { Typography } from "@mui/material";

const StakePage = () => {
  useEffect(() => {
    document.title = "Stake Capital | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Stake Capital</Typography>
      <Typography>Comming soon!</Typography>
    </>
  );
};

export default StakePage;
