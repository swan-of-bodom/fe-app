import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { LoadingAnimation } from "../Loading/Loading";
import { isNonEmptyArray } from "../../utils/utils";

import { WithdrawItem } from "./WithdrawItem";
import { NoContent } from "../TableNoContent";
import { fetchCapital } from "./fetchCapital";
import { useQuery } from "react-query";
import { QueryKeys } from "../../queries/keys";
import { AccountInterface } from "starknet";
import { UserPoolDisplayData } from "../../types/pool";
import { useAccount } from "../../hooks/useAccount";

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

  const itemDataList = data.map(({ parsed }): UserPoolDisplayData => {
    const {
      optionType: type,
      valueOfUserStakeBase,
      valueOfUserStakeDecimal,
      sizeOfUsersTokensBase,
      sizeOfUsersTokensDecimal,
    } = parsed;

    return {
      size: sizeOfUsersTokensDecimal,
      fullSize: sizeOfUsersTokensBase,
      value: valueOfUserStakeDecimal,
      fullValue: valueOfUserStakeBase,
      type,
    };
  });

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
        {itemDataList.map(({ value, fullValue, size, fullSize, type }, i) => (
          <WithdrawItem
            key={i}
            account={account}
            size={size}
            fullSize={fullSize}
            value={value}
            fullValue={fullValue}
            type={type}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export const WithdrawParent = () => {
  const account = useAccount();

  if (!account)
    return <NoContent text="Connect wallet to see your staked capital" />;

  return (
    <WithdrawParentWithAccount account={account} address={account.address} />
  );
};
