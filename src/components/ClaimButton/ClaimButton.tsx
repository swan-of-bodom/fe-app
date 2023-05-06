import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useAccount } from "../../hooks/useAccount";
import { useState } from "react";
import { getProof } from "./getProof";
import { useNetwork } from "../../hooks/useNetwork";
import { NetworkName } from "../../types/network";

const texts = {
  noWallet:
    "To claim your airdrop connect the wallet that is eligible for the airdrop",
  testnet: "Switch to Mainnet to claim airdrop",
  noHint: "",
};

export const ClaimButton = () => {
  const account = useAccount();
  const network = useNetwork();
  const [text, setText] = useState("");

  const isTestnet = network === NetworkName.Testnet;

  let nextText = "";

  if (!account) {
    nextText = texts.noWallet;
  }

  if (isTestnet) {
    nextText = texts.testnet;
  }

  if (text !== nextText && Object.values(texts).includes(text)) {
    setText(nextText);
  }

  const handleClick = () => {
    // if no account button is not clickable
    getProof(account!, setText);
  };

  return (
    <Tooltip title={account ? "" : texts.noWallet}>
      <Box
        sx={{
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          flexFlow: "column",
          m: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={!account || isTestnet}
        >
          Claim airdrop
        </Button>
        <Typography>{text}</Typography>
      </Box>
    </Tooltip>
  );
};
