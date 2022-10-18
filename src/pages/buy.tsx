import { useEffect } from "react";
import { Typography } from "@mui/material";
import { OptionsList } from "../components/optionsList";

const BuyPage = () => {
  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <>
      <Typography variant="h4">Buy Options</Typography>
      <p>You can buy your options right here!</p>
      <OptionsList />
    </>
  );
};

export default BuyPage;
