import { useAccount, useStarknetCall } from "@starknet-react/core";
import { useMemo, useState } from "react";
import { toBN } from "starknet/dist/utils/number";
import { IncrementCounter } from "../components/IncrementCounter";
import { useCounterContract } from "../hooks/counter";
import Typography from "@mui/material/Typography";

const Home = () => {
  const [watch, setWatch] = useState(true);
  const { contract: counter } = useCounterContract();
  const { address } = useAccount();

  const { data: counterResult } = useStarknetCall({
    contract: counter,
    method: "counter",
    args: [],
    options: { watch },
  });

  const counterValue = useMemo(() => {
    if (counterResult && counterResult.length > 0) {
      const value = toBN(counterResult[0]);
      return value.toString(10);
    }
  }, [counterResult]);

  return (
    <>
      <Typography variant="h4">Counter Contract</Typography>
      <Typography noWrap>Wallet Address: {address}</Typography>
      <Typography noWrap>Counter Address: {counter?.address}</Typography>
      <p>Value: {counterValue}</p>
      <p>
        <span>
          Refresh value at every block{" "}
          <input
            type="checkbox"
            checked={watch}
            onChange={(evt) => setWatch(evt.target.checked)}
          />
        </span>
      </p>
      <IncrementCounter />
    </>
  );
};

export default Home;
