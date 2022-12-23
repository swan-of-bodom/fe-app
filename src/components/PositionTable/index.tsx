import { Paper, TableContainer } from "@mui/material";
import { useAccount } from "@starknet-react/core";
import { useEffect, useReducer } from "react";
import { debug } from "../../utils/debugger";
import { fetchPositions, initialState, reducer, State } from "./fetchPositions";
import { PositionTableComponent } from "./PositionTable";

type Props = {
  refresh: boolean;
};

type ElemProps = {
  state: State;
};

const PositionTableElem = ({ state }: ElemProps) => (
  <Paper
    sx={{
      padding: 2,
      width: "100%",
    }}
  >
    <TableContainer elevation={2} component={Paper}>
      <PositionTableComponent state={state} />
    </TableContainer>
  </Paper>
);

const PositionTable = ({ refresh }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { address, status } = useAccount();

  useEffect(() => {
    if (status === "connected" && address && !state.loading) {
      debug("Fetching positons");
      fetchPositions(address, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, refresh]);

  return <PositionTableElem state={state} />;
};

export default PositionTable;
