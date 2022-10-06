import { Button } from "@mui/material";
import { useContract, useStarknetCall } from "@starknet-react/core";
import { StructAbi } from "starknet/types";
import AmmAbi from "../abi/amm_abi.json";
import { weiToEth } from "../utils/utils";

const parsePoolBalance = (d: unknown): string => {
  if (!d || !Array.isArray(d)) {
    return "unknown";
  }
  
  return weiToEth(d[0], 3);
};

export const PoolBalance = () => {
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

  if (error || loading) {
    return (
      <div>
        <p>
          {error && `Error: ${error}`}
          {loading && `Loading...`}
        </p>
        <Button
          variant="contained"
          disabled={true}
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p>
        {parsePoolBalance(data)} ETH
      </p>
      <Button
        variant="contained"
        disabled={!!(loading || error)}
        onClick={refresh}
      >
        Refresh
      </Button>
    </div>
  );
};
