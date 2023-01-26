import { OptionSide, OptionType, OptionWithPremia } from "../../types/options";
import { Box, Button, Paper, TableContainer, useTheme } from "@mui/material";
import { useState } from "react";
import { isFresh } from "../../utils/parseOption";
import OptionsTable from "./OptionsTable";
import { isCall, isDarkTheme, isLong } from "../../utils/utils";
import { LoadingAnimation } from "../loading";
import { NoContent } from "../TableNoContent";
import { fetchOptions } from "./fetchOptions";
import { useQuery } from "react-query";
import { QueryKeys } from "../../queries/keys";
import { debug } from "../../utils/debugger";
import { SlippageButton } from "../Slippage/SlippageButton";

const getText = (type: OptionType, side: OptionSide) =>
  `We currently do not have any ${isLong(side) ? "long" : "short"} ${
    isCall(type) ? "call" : "put"
  } options.`;

type ContentProps = {
  options: OptionWithPremia[];
  type: OptionType;
  side: OptionSide;
  loading: boolean;
  error: boolean;
};

const Content = ({ options, type, side, loading, error }: ContentProps) => {
  if (loading)
    return (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );

  if (error) return <NoContent text="Option not available at the moment" />;

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
  const { isLoading, isError, data } = useQuery(QueryKeys.trade, fetchOptions);

  debug("React query data", { isLoading, isError, data });

  const [side, setLongShort] = useState<OptionSide>(OptionSide.Long);
  const [type, setCallPut] = useState<OptionType>(OptionType.Call);
  const theme = useTheme();

  const filtered = data
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
        marginTop: 4,
        padding: 2,
        width: "100%",
        ...(isDarkTheme(theme) && {
          background: "#393946",
        }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <Button
            variant={isLong(side) ? "contained" : "outlined"}
            onClick={() => setLongShort(OptionSide.Long)}
          >
            Long
          </Button>
          <Button
            variant={isLong(side) ? "outlined" : "contained"}
            onClick={() => setLongShort(OptionSide.Short)}
          >
            Short
          </Button>
          <Button
            variant={isCall(type) ? "contained" : "outlined"}
            onClick={() => setCallPut(OptionType.Call)}
          >
            Call
          </Button>
          <Button
            variant={isCall(type) ? "outlined" : "contained"}
            onClick={() => setCallPut(OptionType.Put)}
          >
            Put
          </Button>
        </div>
        <SlippageButton />
      </Box>
      <TableContainer elevation={2} component={Paper}>
        <Content
          options={filtered}
          side={side}
          type={type}
          loading={isLoading}
          error={isError}
        />
      </TableContainer>
    </Paper>
  );
};

export default TradeTable;
