import { Button } from "@mui/material";
import { useStarknetCall } from "@starknet-react/core";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { useAmmContract } from "../hooks/amm";
import { weiToEth } from "../utils/utils";

const parsePoolBalance = (d: unknown): string => {
  if (!d || !Array.isArray(d)) {
    return "unknown";
  }

  return weiToEth(d[0], 5);
};

export const PoolBalance = () => {
  const { contract } = useAmmContract();

  const { data, loading, error, refresh } = useStarknetCall({
    contract,
    method: AMM_METHODS.GET_POOL_AVAILABLE_BALANCE,
    args: [getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS],
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
        <Button variant="contained" disabled={true}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p>{parsePoolBalance(data)} ETH</p>
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
