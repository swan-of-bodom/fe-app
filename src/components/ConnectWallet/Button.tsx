import { Button } from "@mui/material";
import { Wallet } from "@mui/icons-material";
import { WalletModal } from "./Modal";
import { AccountInfo } from "./AccountInfo";
import { useAccount } from "../../hooks/useAccount";
import { openWalletConnectDialog } from "../../redux/actions";

const buttonStyle = {
  minWidth: "170px",
};

export const WalletButton = () => {
  const account = useAccount();

  if (account) {
    // wallet connected
    return <AccountInfo />;
  }

  return (
    <>
      <WalletModal />
      <Button
        variant="outlined"
        sx={buttonStyle}
        onClick={openWalletConnectDialog}
      >
        <Wallet />
        Connect Wallet
      </Button>
    </>
  );
};
