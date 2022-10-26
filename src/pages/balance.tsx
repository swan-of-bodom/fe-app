import { Typography } from "@mui/material";
import { useEffect } from "react";
import { OwnedOptions } from "../components/ownedOptions";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Options Balance</Typography>
      <p>Review your currently owned options.</p>
      <OwnedOptions />
    </>
  );
};

export default Balance;
