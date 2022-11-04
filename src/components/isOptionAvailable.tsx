import { useStarknetCall } from "@starknet-react/core";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { useAmmContract } from "../hooks/amm";
import { handleBlockChainResponse } from "../utils/utils";

type IsOptionAvailableProps = {
  maturity: string;
  strikePrice: string;
};

export const IsOptionAvailable = ({
  maturity,
  strikePrice,
}: IsOptionAvailableProps) => {
  const { contract } = useAmmContract();

  const { data, loading, error } = useStarknetCall({
    contract,
    method: AMM_METHODS.IS_OPTION_AVAILABLE,
    args: [
      getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS, // lptoken_address
      "0", // option_side
      strikePrice,
      maturity,
    ],
    options: {
      watch: false,
    },
  });

  if (error || loading) {
    return (
      <p>
        {error && `Error: ${error}`}
        {loading && `Loading...`}
      </p>
    );
  }

  const res = handleBlockChainResponse(data);

  return <p>{res && res.toString() === "1" ? "Available" : "Not available"}</p>;
};
