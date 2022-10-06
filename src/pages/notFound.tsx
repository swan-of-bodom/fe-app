import { Typography } from "@mui/material";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    document.title = "404 | Carmine Finance";
  });
  return (
    <>
      <Typography variant="h4">404</Typography>
      <Typography>Sorry, this page does not exist</Typography>
    </>
  );
};
export default NotFound;
