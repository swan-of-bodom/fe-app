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
import { LiveItem } from "./LiveItem";
import { LoadingAnimation } from "../loading";
import { NoContent } from "../TableNoContent";

import { State } from "./fetchPositions";
import { CompositeOption } from "../../types/options";
import { isFresh } from "../../utils/parseOption";

type Props = {
  state: State;
};

export const LiveTable = ({ state }: Props) => {
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
      <NoContent text="It seems you are not currently holding any positions." />
    );

  const liveOptions = state.data.filter(({ raw }: CompositeOption) =>
    isFresh(raw)
  );

  if (!isNonEmptyArray(liveOptions))
    return (
      <NoContent text="It seems you are not currently holding any positions." />
    );

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Option</TableCell>
          <TableCell>Maturity</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {liveOptions.map((o, i: number) => (
          <LiveItem option={o} key={i} />
        ))}
      </TableBody>
    </Table>
  );
};
