import { useEffect } from "react";
import { Layout } from "../components/layout";
import { Typography } from "@mui/material";
import { BuyInsuranceBox } from "../components/Insurance/BuyInsuranceBox";
import { ShowActiveInsurance } from "../components/Insurance/ShowActiveInsurance";

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
      <Typography sx={{ mb: 2, mt: 6 }} variant="h4">
        Active Insurance
      </Typography>
      <ShowActiveInsurance />
    </Layout>
  );
};

export default Insurance;
