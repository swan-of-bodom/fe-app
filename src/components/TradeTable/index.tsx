import { OptionSide, OptionType } from "../../types/options";
import { Button, Paper, TableContainer } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FetchState } from "../../redux/reducers/optionsList";
import { useState } from "react";
import { composeOption, isFresh } from "../../utils/parseOption";
import OptionsTable from "./OptionsTable";

const stateToText = (fs: FetchState): string => {
  switch (fs) {
    case FetchState.NotStarted:
      return "We will get the options in a jiffy!";
    case FetchState.Fetching:
      return "Getting the list of available options...";
    default:
      return "Something went wrong while getting the options.";
  }
};

const NoOptions = () => <p>No options fit your criteria.</p>;

const TradeTable = () => {
  const list = useSelector((s: RootState) => s.rawOptionsList);
  const state = useSelector((s: RootState) => s.state);
  const [longShort, setLongShort] = useState<OptionSide>(OptionSide.Long);
  const [callPut, setCallPut] = useState<OptionType>(OptionType.Call);

  if (state !== FetchState.Done) {
    return <p>{stateToText(state)}</p>;
  }

  if (list.length === 0) {
    return <p>It seems that there are currently no available options.</p>;
  }

  const filtered = list
    .map(composeOption)
    .filter(
      ({ raw, parsed }) =>
        isFresh(raw) &&
        parsed.optionSide === longShort &&
        parsed.optionType === callPut
    );

  return (
    <Paper
      sx={{
        margin: "16px",
        padding: "16px",
        width: "100%",
        background: "#F5F5F5",
      }}
    >
      <Button
        variant={longShort === OptionSide.Long ? "contained" : "outlined"}
        onClick={() => setLongShort(OptionSide.Long)}
      >
        Long
      </Button>
      <Button
        variant={longShort === OptionSide.Long ? "outlined" : "contained"}
        onClick={() => setLongShort(OptionSide.Short)}
      >
        Short
      </Button>
      <Button
        variant={callPut === OptionType.Call ? "contained" : "outlined"}
        onClick={() => setCallPut(OptionType.Call)}
      >
        Call
      </Button>
      <Button
        variant={callPut === OptionType.Call ? "outlined" : "contained"}
        onClick={() => setCallPut(OptionType.Put)}
      >
        Put
      </Button>
      <TableContainer elevation={2} component={Paper}>
        {filtered.length === 0 ? (
          <NoOptions />
        ) : (
          <OptionsTable options={filtered} />
        )}
      </TableContainer>
    </Paper>
  );
};

export default TradeTable;
