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
import { fetchCapital, StakedCapitalInfo } from "./fetchCapital";

export const WithdrawParent = () => {
  const { account, address } = useAccount();
  const [data, setData] = useState<StakedCapitalInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      fetchCapital(address, setData, setLoading);
    }
  }, [address]);

  if (!address)
    return <NoContent text="Connect wallet to see your staked capital." />;

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
          <TableCell># LP Tokens</TableCell>
          <TableCell>Amount to withdraw</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ value, numberOfTokens, type, poolInfo }, i) => (
          <WithdrawItem
            key={i}
            account={account}
            size={numberOfTokens}
            value={value}
            type={type}
            poolInfo={poolInfo}
          />
        ))}
      </TableBody>
    </Table>
  );
};
