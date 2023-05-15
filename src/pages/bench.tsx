import { useEffect, useState } from "react";
import { getMainContract } from "../utils/blockchain";
import { getOptionsWithPositionOfUser } from "../calls/getOptionsWithPosition";
import { RPCNode, rpcNodeCall } from "../calls/rpcNodeCall";
import { Typography } from "@mui/material";

const selector =
  "0x2b20b26ede4304b68503c401a342731579b75844e5696ee13e6286cd51a9621";
const NUM_RUNS = 10;

const sleep = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));

const benchFn = async (cb: () => Promise<any>) => {
  const d = Date.now();
  await cb();
  return (Date.now() - d) / 1000;
};

const average = (array: number[]) =>
  array.reduce((a, b) => a + b) / array.length;

const runBenchmark = async (fn: () => Promise<any>): Promise<string> => {
  const arr = [];
  for (let i = 0; i < NUM_RUNS; i++) {
    const res = await benchFn(fn);
    arr.push(res);
    // sleep in between requests to avoid rate limit
    await sleep(2);
  }
  // prevent interference with next benchmark
  await sleep(5);

  return report(arr);
};

const report = (arr: number[]): string =>
  `average: ${average(arr)}\nmax: ${Math.max(...arr)}\nmin: ${Math.min(
    ...arr
  )}`;

type BenchSummary = { name: string; report: string };

export const bench = async (setData: (v: BenchSummary[]) => void) => {
  const address =
    "0x03d1525605db970fa1724693404f5f64cba8af82ec4aab514e6ebd3dec4838ad";
  const contract = getMainContract();

  const infuraFn = async () =>
    await rpcNodeCall(RPCNode.Infura, contract.address, selector, [address]);
  const blastApiFn = async () =>
    await rpcNodeCall(RPCNode.BlastAPI, contract.address, selector, [address]);
  const starknetFn = async () => await getOptionsWithPositionOfUser(address);

  const infura = await runBenchmark(infuraFn);
  const blast = await runBenchmark(blastApiFn);
  const starknet = await runBenchmark(starknetFn);

  const res = [
    { name: "Infura", report: infura },
    { name: "BlastAPI", report: blast },
    { name: "Starknet Blockchain", report: starknet },
  ];

  setData(res);
};

const BenchPage = () => {
  const [data, setData] = useState<BenchSummary[]>([]);
  useEffect(() => {
    bench(setData);
  }, []);

  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h2">
        Benchmark
      </Typography>
      {data.length === 0 && (
        <Typography>Wait for the test to finish</Typography>
      )}
      {data.length > 0 &&
        data.map((summary: BenchSummary) => (
          <>
            <Typography variant="h4">{summary.name}</Typography>
            <Typography>{summary.report}</Typography>
          </>
        ))}
    </>
  );
};

export default BenchPage;
