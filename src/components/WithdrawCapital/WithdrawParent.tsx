import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "../loading";
import { isNonEmptyArray } from "../../utils/utils";

import { WithdrawItem } from "./WithdrawItem";
import { NoContent } from "../TableNoContent";
import { fetchCapital } from "./fetchCapital";

export const WithdrawParent = () => {
  const { account, address } = useAccount();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      fetchCapital(address, setData, setLoading);
    }
  }, [address]);

  if (loading) {
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );
  }

  if (!isNonEmptyArray(data))
    return <NoContent text="You currently do not have any staked capital." />;

  if (!account) return <NoContent text="No account." />;

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Pool</TableCell>
          <TableCell>Value of staked capital</TableCell>
          <TableCell align="center"># LP Tokens</TableCell>
          <TableCell align="center">Amount to withdraw</TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ stakedCapital, numberOfTokens, type, poolInfo }, i) => (
          <WithdrawItem
            key={i}
            account={account}
            size={stakedCapital}
            value={numberOfTokens}
            type={type}
            poolInfo={poolInfo}
          />
        ))}
      </TableBody>
    </Table>
  );
};
