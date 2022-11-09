import { Typography } from "@mui/material";
import { useEffect } from "react";
import PositionTable from "../components/PositionTable";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Options Balance</Typography>
      <PositionTable />
    </>
  );
};

export default Balance;
