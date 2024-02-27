import { Box, Typography } from "@mui/material";
import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ReferenceLine,
} from "recharts";
import { Color } from "./Graph";
import { CurrencyData, GraphData } from "./profitGraphData";

type ProfitGraphProps = {
  data: GraphData;
};

type CustomTooltipProps = {
  active: boolean;
  color: Color;
  usd?: number;
  currency: string;
};

const CustomTooltip = ({
  active,
  usd,
  color,
  currency,
}: CustomTooltipProps) => {
  if (!active || !usd) {
    return null;
  }

  console.log("GRAPH CURRENCY", currency);

  return (
    <Box>
      <Typography sx={{ color, fontWeight: "800" }}>
        {currency} {usd.toFixed(2)}
      </Typography>
    </Box>
  );
};

export const ProfitGraph = ({ data }: ProfitGraphProps) => {
  const { currency } = data;
  const defaultTooltipData = {
    active: false,
    color: Color.Green,
    currency,
  };
  const [color, setColor] = useState<Color>(Color.Green);
  const [tooltipData, setTooltipData] =
    useState<CustomTooltipProps>(defaultTooltipData);
  const { plot, domain } = data;
  const xAxisTicks = [plot[0].market, plot[plot.length - 1].market];
  const yAxisTicks = [plot[0].usd, 0, plot[plot.length - 1].usd];

  const handleMouseMove = (data: any) => {
    if (!data?.activePayload?.length) {
      return;
    }

    const payload: CurrencyData = data.activePayload[0].payload;

    if (payload) {
      const { usd } = payload;
      const color = usd >= 0 ? Color.Green : Color.Red;

      setColor(color);
      setTooltipData({ active: true, usd, color, currency });
    }
  };

  const handleMouseLeave = () => setTooltipData(defaultTooltipData);

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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <XAxis
          axisLine={{ strokeWidth: 1 }}
          interval={"preserveStartEnd"}
          dataKey="market"
          ticks={xAxisTicks}
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
            <CustomTooltip
              active={tooltipData.active}
              usd={tooltipData.usd}
              color={tooltipData.color}
              currency={tooltipData.currency}
            />
          }
        />
        <Line
          strokeWidth={3}
          dot={false}
          type="linear"
          dataKey="usd"
          stroke={color}
        />
        <ReferenceLine y={0} stroke="#cccccc" strokeWidth={1} />
      </LineChart>
    </ResponsiveContainer>
  );
};
