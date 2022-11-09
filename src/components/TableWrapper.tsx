import { Paper, TableContainer } from "@mui/material";
import { ReactNode } from "react";

type TableWrapperProps = {
  children: ReactNode;
};

export const TableWrapper = (props: TableWrapperProps) => (
  <Paper
    sx={{
      margin: "16px",
      padding: "16px",
      width: "100%",
      background: "#F5F5F5",
    }}
  >
    <TableContainer elevation={2} component={Paper}>
      {props.children}
    </TableContainer>
  </Paper>
);
