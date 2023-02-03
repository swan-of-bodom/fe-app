import { Box, Paper, useTheme } from "@mui/material";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { isDarkTheme } from "../../utils/utils";

export const ComplexGraph = () => {
  const theme = useTheme();
  const style = {
    padding: 1,
    paddingBottom: 4,
    ...(isDarkTheme(theme) && {
      background: "#393946",
    }),
  };
  const boxStyle = {
    [theme.breakpoints.down("md")]: {
      aspectRatio: "1 / 1",
    },
    [theme.breakpoints.up("md")]: {
      aspectRatio: "5 / 2",
    },
  };
  return (
    <Paper sx={style} elevation={2}>
      <Box sx={boxStyle}>
        <AdvancedRealTimeChart
          autosize
          theme={theme.palette.mode}
          symbol="BINANCE:ETHUSD"
          interval="5"
          range="1D"
          timezone="Europe/Berlin"
          // eslint-disable-next-line react/style-prop-object
          style="1" // conflict with react style and trading view style
          locale="en"
          allow_symbol_change
          hide_side_toolbar
        />
      </Box>
    </Paper>
  );
};
