import { useAccount, useConnectors } from "@starknet-react/core";
import { Button } from "@mui/material";
import { Wallet } from "@mui/icons-material";
import { useState } from "react";
import { WalletModal } from "./Modal";
import { AccountInfo } from "./AccountInfo";

const buttonStyle = {
  minWidth: "170px",
};

export const WalletButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { connector, address } = useAccount();
  const { disconnect } = useConnectors();

  const handleConnect = () => {
    setOpen(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setOpen(false);
  };

  if (connector?.options.id && address) {
    // wallet connected
    return (
      <AccountInfo
        connector={connector}
        address={address}
        disconnect={handleDisconnect}
      />
    );
  }

  return (
    <>
      <WalletModal open={open} setOpen={setOpen} />
      <Button variant="outlined" sx={buttonStyle} onClick={handleConnect}>
        <Wallet />
        Connect Wallet
      </Button>
    </>
  );
};
