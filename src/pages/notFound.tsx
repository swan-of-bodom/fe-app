import { Typography } from "@mui/material";
import { useEffect } from "react";
import { Layout } from "../components/layout";

const NotFound = () => {
  useEffect(() => {
    document.title = "404 | Carmine Finance";
  });
  return (
    <Layout>
      <Typography sx={{ mb: 2 }} variant="h4">
        404
      </Typography>
      <Typography>Sorry, this page does not exist</Typography>
    </Layout>
  );
};
export default NotFound;
