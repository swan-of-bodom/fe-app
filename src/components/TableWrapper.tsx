import { Paper, TableContainer } from "@mui/material";
import { ReactNode } from "react";

type TableWrapperProps = {
  children: ReactNode;
};

export const TableWrapper = (props: TableWrapperProps) => (
  <Paper
    sx={{
      marginTop: 2,
      marginBottom: 2,
      padding: 2,
      width: "100%",
      background: "#393946",
    }}
  >
    <TableContainer elevation={2} component={Paper}>
      {props.children}
    </TableContainer>
  </Paper>
);
