import { Paper } from "@mui/material";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

// "autosize": true,
// "symbol": "COINBASE:ETHUSD",
// "interval": "D",
// "timezone": "Etc/UTC",
// "theme": "dark",
// "style": "1",
// "locale": "en",
// "toolbar_bg": "#f1f3f6",
// "enable_publishing": false,
// "allow_symbol_change": true,
// "container_id": "tradingview_3211c"

const style = {
  height: "400px",
  padding: 1,
};

export const ComplexGraph = () => (
  <Paper sx={style} elevation={2}>
    <AdvancedRealTimeChart
      theme="dark"
      autosize
      symbol="COINBASE:ETHUSD"
      interval="D"
      timezone="Etc/UTC"
      // eslint-disable-next-line react/style-prop-object
      style="1" // conflict with react style and trading view style
      locale="en"
      allow_symbol_change
      hide_side_toolbar
    />
  </Paper>
);
