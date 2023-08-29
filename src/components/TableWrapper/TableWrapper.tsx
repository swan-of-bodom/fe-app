import { Box, Paper, TableContainer } from "@mui/material";
import { ReactNode } from "react";
import { SlippageButton } from "../Slippage/SlippageButton";

type TableWrapperProps = {
  slippage?: boolean;
  children: ReactNode;
};

export const TableWrapper = (props: TableWrapperProps) => {
  const { slippage, children } = props;
  return (
    <Paper
      sx={{
        marginTop: 2,
        marginBottom: 2,
        padding: 2,
        width: "100%",
        background: "#393946",
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
