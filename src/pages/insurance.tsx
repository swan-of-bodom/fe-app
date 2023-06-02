import { useEffect } from "react";
import { Layout } from "../components/layout";
import { Typography } from "@mui/material";
import { BuyInsuranceBox } from "../components/Insurance/BuyInsuranceBox";

const Insurance = () => {
  useEffect(() => {
    document.title = "Insurance | Carmine Finance";
  });

  return (
    <Layout>
      <Typography sx={{ mb: 2 }} variant="h4">
        Buy Insurance
      </Typography>
      <BuyInsuranceBox />
    </Layout>
  );
};

export default Insurance;
