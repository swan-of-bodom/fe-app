import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { fetchPositions } from "./fetchPositions";
import { LiveTable } from "./LiveTable";
import { TableWrapper } from "../TableWrapper";
import { InMoneyTable } from "./InMoneyTable";
import { OutOfMoneyTable } from "./OutOfMoneyTable";
import { Cached } from "@mui/icons-material";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { useQuery } from "react-query";
import { QueryKeys } from "../../queries/keys";

export const Positions = () => {
  const [refresh, toggleRefresh] = useState<boolean>(false);
  const { address } = useAccount();
  const { isLoading, isError, data } = useQuery(
    [QueryKeys.position, address],
    fetchPositions
  );

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
        <LiveTable isLoading={isLoading} isError={isError} data={data} />
      </TableWrapper>
      <Typography variant="h4">Expired - Profit</Typography>
      <Typography sx={{ maxWidth: "66ch" }}>
        These options matured in the money and you will get your funds upon
        settling.
      </Typography>
      <TableWrapper>
        <InMoneyTable isLoading={isLoading} isError={isError} data={data} />
      </TableWrapper>
      <Typography variant="h4">Expired - No Profit</Typography>
      <Typography sx={{ maxWidth: "66ch" }}>
        These options matured out of the money, you will not receive any funds
        from settling them. Settling these options will simply remove them.
      </Typography>
      <TableWrapper>
        <OutOfMoneyTable isLoading={isLoading} isError={isError} data={data} />
      </TableWrapper>
    </>
  );
};
