import { Button } from "@mui/material";
import { Wallet } from "@mui/icons-material";
import { useState } from "react";
import { WalletModal } from "./Modal";
import { AccountInfo } from "./AccountInfo";
import { useAccount } from "../../hooks/useAccount";

const buttonStyle = {
  minWidth: "170px",
};

export const WalletButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const account = useAccount();

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  if (account) {
    // wallet connected
    return <AccountInfo close={handleClose} />;
  }

  return (
    <>
      <WalletModal open={open} setOpen={setOpen} />
      <Button variant="outlined" sx={buttonStyle} onClick={handleOpen}>
        <Wallet />
        Connect Wallet
      </Button>
    </>
  );
};
