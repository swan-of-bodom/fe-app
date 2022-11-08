import { CompositeOption, OptionSide, OptionType } from "../../types/options";
import { Box, Button, Paper, TableContainer, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FetchState } from "../../redux/reducers/optionsList";
import { useState } from "react";
import { isFresh } from "../../utils/parseOption";
import OptionsTable from "./OptionsTable";
import { isNonEmptyArray } from "../../utils/utils";
import { LoadingAnimation } from "../loading";

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

  if (state === FetchState.Failed) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Typography>
          Something went wrong while getting the list of options.
        </Typography>
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
  const list = useSelector(
    (s: RootState) => s.optionsList.compositeOptionsList
  );
  const [side, setLongShort] = useState<OptionSide>(OptionSide.Long);
  const [type, setCallPut] = useState<OptionType>(OptionType.Call);

  const filtered = isNonEmptyArray(list)
    ? list.filter(
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
