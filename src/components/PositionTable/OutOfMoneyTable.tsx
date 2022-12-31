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
import { OutOfMoneyItem } from "./OutOfMoneyItem";
import { LoadingAnimation } from "../loading";
import { NoContent } from "../TableNoContent";

import { State } from "./fetchPositions";
import { CompositeOption } from "../../types/options";
import { isFresh } from "../../utils/parseOption";

type Props = {
  state: State;
};

export const OutOfMoneyTable = ({ state }: Props) => {
  const { address } = useAccount();

  if (!address)
    return <NoContent text="Connect your wallet to see your positions." />;

  if (state.loading)
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );

  if (state.error)
    return (
      <NoContent text="Something went wrong while getting your positions, please try again later." />
    );

  if (!isNonEmptyArray(state.data))
    return (
      <NoContent text="It seems you are not currently holding any out-of-the-money options." />
    );

  const outOptions = state.data.filter(
    ({ raw, parsed }: CompositeOption) =>
      !isFresh(raw) && !parsed?.positionValue
  );

  if (!isNonEmptyArray(outOptions))
    return (
      <NoContent text="It seems you are not currently holding any out-of-the-money options." />
    );

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Option</TableCell>
          <TableCell>Expiry</TableCell>
          <TableCell>Size</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {outOptions.map((o, i: number) => (
          <OutOfMoneyItem option={o} key={i} />
        ))}
      </TableBody>
    </Table>
  );
};
