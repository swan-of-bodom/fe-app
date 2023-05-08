import { Typography } from "@mui/material";
import { ClaimButton } from "./ClaimButton";
import { useAccount } from "../../hooks/useAccount";
import { useEffect, useState } from "react";
import { useNetwork } from "../../hooks/useNetwork";
import { NetworkName } from "../../types/network";
import { getProof } from "./getProof";
import { AccountInterface } from "starknet";
import { hexToBN } from "../../utils/utils";
import { intToDecimal } from "../../utils/units";

type Props = {
  account: AccountInterface | undefined;
  message: string;
  data?: string[];
};

const AirdropTemplate = ({ account, message, data }: Props) => (
  <>
    <Typography sx={{ mb: 2, mt: 5 }} variant="h4">
      Airdrop
    </Typography>
    <Typography>{message}</Typography>
    {account && <ClaimButton account={account} data={data} />}
  </>
);

export const Airdrop = () => {
  const account = useAccount();
  const network = useNetwork();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[] | undefined>();

  const isMainnet = network === NetworkName.Mainnet;

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
    const amount = intToDecimal(hexToBN(data[1]).toString(10), 18);
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
