import { Paper } from "@mui/material";
import Graph from "./Graph";

const CryptoGraph = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        height: "300px",
        background: "#F5F5F5",
        margin: "16px",
      }}
    >
      <Graph />
    </Paper>
  );
};

export default CryptoGraph;
