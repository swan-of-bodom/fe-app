import { Paper, TableContainer } from "@mui/material";
import { PositionTableComponent } from "./PositionTable";

const PositionTable = () => (
  <Paper
    sx={{
      margin: "16px",
      padding: "16px",
      width: "100%",
      background: "#F5F5F5",
    }}
  >
    <TableContainer elevation={2} component={Paper}>
      <PositionTableComponent />
    </TableContainer>
  </Paper>
);

export default PositionTable;
