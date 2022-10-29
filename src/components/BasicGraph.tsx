import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type IHistoricData = Array<number[]>;

const cryptoState = {
  currency: "USD",
  symbol: "$",
};

const HistoricalChart = (id: string, days = 365, currency: string) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

const BasicGraph = () => {
  const [historicData, setHistoricData] = useState<IHistoricData>();
  const { currency } = cryptoState;

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart("ethereum", 7, currency));
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!historicData) {
    return (
      <CircularProgress style={{ color: "gold" }} size={250} thickness={1} />
    );
  }

  const formatDate = (timestamp: number): string =>
    new Date(timestamp).toLocaleString("en-GB");

  const data = historicData.map(([t, v]) => ({
    t: formatDate(t),
    usd: v.toFixed(2),
  }));

  const padding = 0.05;
  const handleMin = (n: number) => Math.round(n * (1 - padding));
  const handleMax = (n: number) => Math.round(n * (1 + padding));

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        height: "300px",
        background: "#F5F5F5",
        margin: "16px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis hide={true} dataKey="t" />
          <YAxis hide={true} domain={[handleMin, handleMax]} />
          <Tooltip />
          <Line
            strokeWidth={3}
            dot={false}
            type="monotone"
            dataKey="usd"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default BasicGraph;
