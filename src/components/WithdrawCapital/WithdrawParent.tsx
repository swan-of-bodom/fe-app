import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import { LoadingAnimation } from "../loading";
import { isNonEmptyArray } from "../../utils/utils";

import { WithdrawItem } from "./WithdrawItem";
import { NoContent } from "../TableNoContent";
import { fetchCapital } from "./fetchCapital";
import { useQuery } from "react-query";
import { QueryKeys } from "../../queries/keys";
import { AccountInterface } from "starknet";

type Props = { address: string; account: AccountInterface };

const WithdrawParentWithAccount = ({ address, account }: Props) => {
  const { isLoading, isError, isFetching, data } = useQuery(
    [QueryKeys.stake, address],
    fetchCapital
  );

  if (isLoading) {
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );
  }

  if (isError)
    return <NoContent text="Something went wrong, please try again later" />;

  if (!isNonEmptyArray(data))
    return <NoContent text="You currently do not have any staked capital" />;

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Pool</TableCell>
          <TableCell>Value of staked capital</TableCell>
          <TableCell># LP Tokens</TableCell>
          <TableCell>Amount to withdraw</TableCell>
          <TableCell align="right">
            {isFetching && <LoadingAnimation size={30} />}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ value, size, type }, i) => (
          <WithdrawItem
            key={i}
            account={account}
            size={size}
            value={value}
            type={type}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export const WithdrawParent = () => {
  const { account, address } = useAccount();

  if (!address || !account)
    return <NoContent text="Connect wallet to see your staked capital" />;

  return <WithdrawParentWithAccount account={account} address={address} />;
};
