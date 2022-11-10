import { CompositeOption, OptionSide, OptionType } from "../../types/options";
import { Box, Button, Paper, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import { isFresh } from "../../utils/parseOption";
import OptionsTable from "./OptionsTable";
import { isNonEmptyArray } from "../../utils/utils";
import { LoadingAnimation } from "../loading";
import { NoContent } from "../TableNoContent";
import { useAmmContract } from "../../hooks/amm";
import { fetchOptions } from "./fetchOptions";
import { debug } from "../../utils/debugger";

const getText = (
  type: OptionType,
  side: OptionSide
) => `We currently do not have any ${
  side === OptionSide.Long ? "long" : "short"
}{" "}
      ${type === OptionType.Call ? "call" : "put"} options.`;

type ContentProps = {
  options: CompositeOption[];
  type: OptionType;
  side: OptionSide;
  loading: boolean;
  error: string;
};

const Content = ({ options, type, side, loading, error }: ContentProps) => {
  if (loading)
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );

  if (error)
    return (
      <NoContent text="Something went wrong while getting the list of options." />
    );

  return (
    <>
      {options.length === 0 ? (
        <NoContent text={getText(type, side)} />
      ) : (
        <OptionsTable options={options} />
      )}
    </>
  );
};

const TradeTable = () => {
  const { contract } = useAmmContract();
  const [side, setLongShort] = useState<OptionSide>(OptionSide.Long);
  const [type, setCallPut] = useState<OptionType>(OptionType.Call);
  const [data, setData] = useState<CompositeOption[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (contract && !loading) {
      fetchOptions(contract, setLoading, setError, setData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const filtered = isNonEmptyArray(data)
    ? data.filter(
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
        <Content
          options={filtered}
          side={side}
          type={type}
          loading={loading}
          error={error}
        />
      </TableContainer>
    </Paper>
  );
};

export default TradeTable;
