import { isNonEmptyArray } from "../../utils/utils";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import { InMoneyItem } from "./InMoneyItem";
import { LoadingAnimation } from "../loading";
import { NoContent } from "../TableNoContent";

import { CompositeOption } from "../../types/options";
import { isFresh } from "../../utils/parseOption";
import { QueryCompositeList } from "../../types/common";

export const InMoneyTable = ({
  isLoading,
  isError,
  data,
}: QueryCompositeList) => {
  const { address } = useAccount();

  if (!address)
    return <NoContent text="Connect your wallet to see your positions." />;

  if (isLoading)
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );

  if (isError)
    return (
      <NoContent text="Something went wrong while getting your positions, please try again later." />
    );

  if (!isNonEmptyArray(data))
    return (
      <NoContent text="It seems you are not currently holding any in-the-the-money options." />
    );

  const inOptions = data.filter(
    ({ raw, parsed }: CompositeOption) =>
      !isFresh(raw) && !!parsed?.positionValue
  );

  if (!isNonEmptyArray(inOptions))
    return (
      <NoContent text="It seems you are not currently holding any in-the-the-money options." />
    );

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Option</TableCell>
          <TableCell>Expiry</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Value</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {inOptions.map((o, i: number) => (
          <InMoneyItem option={o} key={i} />
        ))}
      </TableBody>
    </Table>
  );
};
