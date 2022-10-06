import Button from "@mui/material/Button";
import { useAccount, useStarknetExecute } from "@starknet-react/core";
import React from "react";

export const IncrementCounter = () => {
  const { address, account } = useAccount();

  const payload = {
    calls: {
      contractAddress:
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      entrypoint: "transfer",
      calldata: [address, 1, 0],
    },
    metadata: {
      method: "incrementCounter",
      message: "increment counter by 1",
    },
  };

  const { execute } = useStarknetExecute(payload);

  if (!account) {
    return null;
  }

  return (
    <div>
      <Button variant="contained" onClick={() => execute()}>
        Increment Counter by 1
      </Button>
    </div>
  );
};
