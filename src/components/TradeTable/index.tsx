import { CompositeOption, OptionSide, OptionType } from "../../types/options";
import { Box, Button, Paper, TableContainer } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FetchState } from "../../redux/reducers/optionsList";
import { useState } from "react";
import { composeOption, isFresh } from "../../utils/parseOption";
import OptionsTable from "./OptionsTable";
import { isNonEmptyArray } from "../../utils/utils";
import { LoadingAnimation } from "../loading";

const stateToText = (v: FetchState): string => {
  switch (v) {
    case FetchState.NotStarted:
      return "We will get the options in a jiffy!";
    case FetchState.Fetching:
      return "Getting the list of available options...";
    default:
      return "Something went wrong while getting the options.";
  }
};

type NoOptionsProps = {
  type: OptionType;
  side: OptionSide;
};

const NoOptions = ({ type, side }: NoOptionsProps) => (
  <Box sx={{ textAlign: "center" }}>
    <p>
      We currently do not have any {side === OptionSide.Long ? "long" : "short"}{" "}
      {type === OptionType.Call ? "call" : "put"} options.
    </p>
  </Box>
);

type ContentProps = {
  options: CompositeOption[];
  type: OptionType;
  side: OptionSide;
};

const Content = ({ options, type, side }: ContentProps) => {
  const state = useSelector((s: RootState) => s.optionsList.state);

  if (state === FetchState.Fetching) {
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );
  }

  return (
    <>
      {options.length === 0 ? (
        <NoOptions type={type} side={side} />
      ) : (
        <OptionsTable options={options} />
      )}
    </>
  );
};

const TradeTable = () => {
  const list = useSelector((s: RootState) => s.optionsList.rawOptionsList);
  const [side, setLongShort] = useState<OptionSide>(OptionSide.Long);
  const [type, setCallPut] = useState<OptionType>(OptionType.Call);

  const filtered = isNonEmptyArray(list)
    ? list
        .map(composeOption)
        .filter(
          ({ raw, parsed }) =>
            isFresh(raw) &&
            parsed.optionSide === side &&
            parsed.optionType === type
        )
    : [];

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
        variant={side === OptionSide.Long ? "contained" : "outlined"}
        onClick={() => setLongShort(OptionSide.Long)}
      >
        Long
      </Button>
      <Button
        variant={side === OptionSide.Long ? "outlined" : "contained"}
        onClick={() => setLongShort(OptionSide.Short)}
      >
        Short
      </Button>
      <Button
        variant={type === OptionType.Call ? "contained" : "outlined"}
        onClick={() => setCallPut(OptionType.Call)}
      >
        Call
      </Button>
      <Button
        variant={type === OptionType.Call ? "outlined" : "contained"}
        onClick={() => setCallPut(OptionType.Put)}
      >
        Put
      </Button>
      <TableContainer elevation={2} component={Paper}>
        <Content options={filtered} side={side} type={type} />
      </TableContainer>
    </Paper>
  );
};

export default TradeTable;
