import { Box, Typography } from "@mui/material";
import { ClaimButton } from "./ClaimButton";
import { useAccount } from "../../hooks/useAccount";
import { useEffect, useState } from "react";
import { useNetwork } from "../../hooks/useNetwork";
// import { NetworkName } from "../../types/network";
import { getProof } from "./getProof";
import { AccountInterface } from "starknet";
import { hexToBN } from "../../utils/utils";

type Props = {
  account: AccountInterface | undefined;
  message: string;
  data?: string[];
};

const AirdropTemplate = ({ account, message, data }: Props) => (
  <Box sx={{ my: 4 }}>
    <Typography sx={{ mb: 2 }} variant="h4">
      Airdrop
    </Typography>
    <Typography>{message}</Typography>
    {account && <ClaimButton account={account} data={data} />}
  </Box>
);

export const Airdrop = () => {
  const account = useAccount();
  const network = useNetwork();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[] | undefined>();

  // for testing purposes treat every network as Mainnet
  // const isMainnet = network === NetworkName.Mainnet;
  const isMainnet = true;

  useEffect(() => {
    if (account && isMainnet) {
      setLoading(true);
      getProof(account).then((res) => {
        if (res.eligible) {
          setData(res.data);
        } else {
          setData(undefined);
        }
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, network]);

  if (!isMainnet) {
    return (
      <AirdropTemplate
        account={undefined}
        message="Please switch to Mainnet to access airdrop"
      />
    );
  }

  if (loading) {
    return (
      <AirdropTemplate
        account={account}
        message="Checking if you are eligible for and airdrop..."
      />
    );
  }

  if (!account) {
    return (
      <AirdropTemplate
        account={account}
        message="Connect your wallet to see if you are eligible for an airdrop"
      />
    );
  }

  if (account && data) {
    const amount = hexToBN(data[1]).toString(10);
    const message = `You are eligible to receive ${amount} Carmine tokens!`;

    return <AirdropTemplate account={account} data={data} message={message} />;
  }

  return (
    <AirdropTemplate
      account={account}
      message="Connected wallet is not eligible for an airdrop"
    />
  );
};
