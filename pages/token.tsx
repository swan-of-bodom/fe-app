import { Box, Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import type { NextPage } from "next";
import { useCallback, useMemo, useState } from "react";
import { toBN } from "starknet/dist/utils/number";
import { bnToUint256, uint256ToBN } from "starknet/dist/utils/uint256";
import Layout from "~/components/Layout";
import { TransactionList } from "~/components/TransactionList";
import { useTokenContract } from "~/hooks/token";

export function UserBalance() {
  const { account } = useStarknet();
  const { contract } = useTokenContract();

  const { data, loading, error } = useStarknetCall({
    contract,
    method: "balanceOf",
    args: account ? [account] : undefined,
  });

  const content = useMemo(() => {
    if (loading || !data?.length) {
      return <div>Loading balance</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    const balance = uint256ToBN(data[0]);
    return <div>{balance.toString(10)}</div>;
  }, [data, loading, error]);

  return (
    <div>
      <h2>User balance</h2>
      {content}
    </div>
  );
}

function MintToken() {
  const { account } = useStarknet();
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();

  const { contract } = useTokenContract();

  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract,
    method: "mint",
  });

  const updateAmount = useCallback(
    (newAmount: string) => {
      // soft-validate amount
      setAmount(newAmount);
      try {
        toBN(newAmount);
        setAmountError(undefined);
      } catch (err) {
        console.error(err);
        setAmountError("Please input a valid number");
      }
    },
    [setAmount]
  );

  const onMint = useCallback(() => {
    reset();
    if (account && !amountError) {
      const message = `${amount.toString()} tokens to ${account}`;
      const amountBn = bnToUint256(amount);
      invoke({
        args: [account, amountBn],
        metadata: { method: "mint", message },
      });
    }
  }, [account, amount, amountError, invoke, reset]);

  const mintButtonDisabled = useMemo(() => {
    if (loading) return true;
    return !account || !!amountError;
  }, [loading, account, amountError]);

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          display: "flex",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Amount"
          id="outlined-size-small"
          size="small"
          type="number"
          value={amount}
          onChange={(evt) => updateAmount(evt.target.value)}
        />
        <Button
          variant="contained"
          disabled={mintButtonDisabled}
          onClick={onMint}
        >
          {loading ? "Waiting for wallet" : "Mint"}
        </Button>
      </Box>
      {error && <Typography noWrap>Error: {error}</Typography>}
    </div>
  );
}

const TokenPage: NextPage = () => {
  const { account } = useStarknet();
  const [message] = useState("Hello, Bob!");

  return (
    <Layout>
      <p>{message}</p>
      <Typography variant="h4">Token Minting</Typography>
      {account ? (
        <>
          <Typography noWrap>Connected: {account}</Typography>
          <UserBalance />
          <MintToken />
          <TransactionList />
        </>
      ) : (
        <Typography noWrap>You need to connect your wallet first</Typography>
      )}
    </Layout>
  );
};

export default TokenPage;
