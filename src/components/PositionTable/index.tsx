import { useAccount } from "@starknet-react/core";
import { useEffect, useReducer, useState } from "react";
import { debug } from "../../utils/debugger";
import { fetchPositions, initialState, reducer } from "./fetchPositions";
import { LiveTable } from "./LiveTable";
import { TableWrapper } from "../TableWrapper";
import { InMoneyTable } from "./InMoneyTable";
import { OutOfMoneyTable } from "./OutOfMoneyTable";
import { Cached } from "@mui/icons-material";
import { Box, Typography, Button, Tooltip } from "@mui/material";

export const Positions = () => {
  const [refresh, toggleRefresh] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { address, status } = useAccount();

  useEffect(() => {
    if (status === "connected" && address && !state.loading) {
      debug("Fetching positons");
      fetchPositions(address, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, refresh]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Typography sx={{ flexGrow: 1 }} variant="h4">
          Options Balance
        </Typography>
        <Tooltip title="Refresh your positions">
          <Button onClick={() => toggleRefresh(!refresh)}>
            <Cached />
          </Button>
        </Tooltip>
      </Box>
      <Typography sx={{ maxWidth: "66ch" }}>
        These options have not matured yet. You can either close your position
        or wait for the maturity.
      </Typography>
      <TableWrapper>
        <LiveTable state={state} />
      </TableWrapper>
      <Typography variant="h4">Expired - Profit</Typography>
      <Typography sx={{ maxWidth: "66ch" }}>
        These options matured in the money and you will get your funds upon
        settling.
      </Typography>
      <TableWrapper>
        <InMoneyTable state={state} />
      </TableWrapper>
      <Typography variant="h4">Expired - No Profit</Typography>
      <Typography sx={{ maxWidth: "66ch" }}>
        These options matured out of the money, you will not receive any funds
        from settling them. Settling these options will simply remove them.
      </Typography>
      <TableWrapper>
        <OutOfMoneyTable state={state} />
      </TableWrapper>
    </>
  );
};
