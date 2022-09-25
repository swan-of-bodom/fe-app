import Button from "@mui/material/Button";
import { useStarknet, useStarknetInvoke } from "@starknet-react/core";
import React from "react";
import { useCounterContract } from "~/hooks/counter";

export function IncrementCounter() {
  const { account } = useStarknet();
  const { contract: counter } = useCounterContract();
  const { invoke } = useStarknetInvoke({
    contract: counter,
    method: "incrementCounter",
  });

  if (!account) {
    return null;
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() =>
          invoke({
            args: ["0x1"],
            metadata: {
              method: "incrementCounter",
              message: "increment counter by 1",
            },
          })
        }
      >
        Increment Counter by 1
      </Button>
    </div>
  );
}
