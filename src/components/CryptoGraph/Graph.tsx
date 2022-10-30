import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  formatGraphDate,
  getHistoricalChartUrl,
  graphDomain,
  validateResponse,
} from "./utils";

export type IHistoricData = Array<number[]>;

const LoadingAnimation = () => (
  <Box
    sx={{
      display: "flex",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress size={90} />
  </Box>
);

const Graph = () => {
  const [historicData, setHistoricData] = useState<IHistoricData | null>(null);
  const [days, setDays] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(getHistoricalChartUrl(days))
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        if (validateResponse(data)) {
          return setHistoricData(data.prices);
        }
        throw Error("Failed to validate fetch data");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  if (!historicData || loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <p>Something went wrong :( {error}</p>;
  }

  const data = historicData.map(([t, v]) => ({
    t: formatGraphDate(t),
    usd: v.toFixed(2),
  }));

  return (
    <>
      <ButtonGroup size="small" aria-label="small button group">
        <Button onClick={() => setDays(1)}>1D</Button>
        <Button onClick={() => setDays(7)}>1W</Button>
        <Button onClick={() => setDays(30)}>1M</Button>
      </ButtonGroup>
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
          <YAxis hide={true} domain={graphDomain} />
          <Tooltip />
          <Line strokeWidth={3} dot={false} type="monotone" dataKey="usd" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Graph;
