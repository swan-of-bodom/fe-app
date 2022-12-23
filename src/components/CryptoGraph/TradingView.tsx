import { Paper } from "@mui/material";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const style = {
  height: "min(70vh, 100vw)",
  padding: 1,
  paddingBottom: 4,
};

export const ComplexGraph = () => (
  <Paper sx={style} elevation={2}>
    <AdvancedRealTimeChart
      autosize
      theme="dark"
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
  </Paper>
);
