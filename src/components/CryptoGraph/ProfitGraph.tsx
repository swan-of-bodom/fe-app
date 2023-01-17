import { Box, Typography } from "@mui/material";
import { memo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ReferenceLine,
} from "recharts";
import { isNonEmptyArray } from "../../utils/utils";
import { Color } from "./Graph";
import { GraphData } from "./profitGraphData";

type ProfitGraphProps = {
  data: GraphData;
};

const CustomTooltip = memo(
  ({ active, payload, firstValue, color, setColor }: any) => {
    if (!active || !isNonEmptyArray(payload) || !payload[0].value) {
      return null;
    }
    const currentValue = payload[0].value;
    const newColor = currentValue < firstValue ? Color.Red : Color.Green;
    if (color !== newColor) {
      setColor(newColor);
    }
    return (
      <Box>
        <Typography sx={{ color, fontWeight: "800" }}>
          ${currentValue.toFixed(2)}
        </Typography>
      </Box>
    );
  },
  (prev, next) => prev === next
);

export const ProfitGraph = ({ data }: ProfitGraphProps) => {
  const [color, setColor] = useState<Color>(Color.Green);
  const { plot, domain } = data;
  const xAxisTicks = [plot[0].market, plot[plot.length - 1].market];
  const yAxisTicks = [plot[0].usd, 0, plot[plot.length - 1].usd];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={plot}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          axisLine={{ strokeWidth: 1 }}
          ticks={xAxisTicks}
          interval={"preserveStartEnd"}
          dataKey="market"
        />
        <YAxis
          axisLine={{ strokeWidth: 1 }}
          ticks={yAxisTicks}
          tickFormatter={(t) => t.toFixed(2)}
          interval={"preserveStartEnd"}
          domain={domain}
        />
        <Tooltip
          content={
            <CustomTooltip firstValue={0} color={color} setColor={setColor} />
          }
        />
        <Line
          strokeWidth={3}
          dot={false}
          type="monotone"
          dataKey="usd"
          stroke={color}
        />
        <ReferenceLine y={0} stroke="#cccccc" strokeWidth={1} />
      </LineChart>
    </ResponsiveContainer>
  );
};
