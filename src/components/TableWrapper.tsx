import { Box, Paper, TableContainer, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { isDarkTheme } from "../utils/utils";
import { SlippageButton } from "./Slippage/SlippageButton";

type TableWrapperProps = {
  slippage?: boolean;
  children: ReactNode;
};

export const TableWrapper = (props: TableWrapperProps) => {
  const theme = useTheme();
  const { slippage, children } = props;
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
      {slippage && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <SlippageButton />
        </Box>
      )}
      <TableContainer elevation={2} component={Paper}>
        {children}
      </TableContainer>
    </Paper>
  );
};
