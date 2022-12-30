import { Paper, TableContainer, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { isDarkTheme } from "../utils/utils";

type TableWrapperProps = {
  children: ReactNode;
};

export const TableWrapper = (props: TableWrapperProps) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        marginTop: 2,
        marginBottom: 2,
        padding: 2,
        width: "100%",
        ...(isDarkTheme(theme) && {
          background: "#393946",
        }),
      }}
    >
      <TableContainer elevation={2} component={Paper}>
        {props.children}
      </TableContainer>
    </Paper>
  );
};
