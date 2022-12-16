import { useConnectors, useAccount } from "@starknet-react/core";
import { Button } from "@mui/material";
import { Wallet } from "@mui/icons-material";
import { useState } from "react";
import { WalletModal } from "./Modal";
import { SupportedWalletIds } from "../../types/wallet";
import { ArgentIcon, BraavosIcon } from "../assets";

const iconStyle = {
  width: 30,
  marginRight: 1,
};

const buttonStyle = {
  minWidth: "170px",
};

export const WalletButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { account, connector } = useAccount();
  const { disconnect } = useConnectors();

  const handleConnect = () => {
    setOpen(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setOpen(false);
  };

  if (account) {
    // wallet connected
    return (
      <Button sx={buttonStyle} onClick={handleDisconnect}>
        <>
          {connector?.options.id === SupportedWalletIds.ArgentX && (
            <ArgentIcon sx={iconStyle} />
          )}
          {connector?.options.id === SupportedWalletIds.Braavos && (
            <BraavosIcon sx={iconStyle} />
          )}
          Disconnect
        </>
      </Button>
    );
  }

  return (
    <>
      <WalletModal open={open} setOpen={setOpen} />
      <Button sx={buttonStyle} onClick={handleConnect}>
        <Wallet />
        Connect Wallet
      </Button>
    </>
  );
};
