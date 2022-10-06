import { Button } from "@mui/material";
import { useContract, useStarknetCall } from "@starknet-react/core";
import { StructAbi } from "starknet/types";
import AmmAbi from "../abi/amm_abi.json";

const Balance = () => {
  const { contract } = useContract({
    address:
      "0x031bc941e58ee989d346a3e12b2d367228c6317bb9533821ce7a29d487ae12bc",
    abi: AmmAbi as StructAbi[],
  });

  const { data, loading, error, refresh } = useStarknetCall({
    contract,
    method: "get_pool_available_balance",
    args: [
      "0x02733d9218f96aaa5908ec99eff401f5239aa49d8102aae8f4c7f520c5260d5c",
    ],
    options: {
      watch: false,
    },
  });

  if (loading) return <span>Loading...</span>;
  if (error) return <span>Error: {error}</span>;

  console.log({ data });

  return (
    <div>
      <Button variant="contained" onClick={refresh}>
        Refresh
      </Button>
      <p>Balance: {JSON.stringify(data)}</p>
    </div>
  );
};

export default Balance;
