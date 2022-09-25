import { useStarknet, useConnectors, Connector } from "@starknet-react/core";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import { Box, ListItemButton } from "@mui/material";
import { useState } from "react";
import WalletIcon from "@mui/icons-material/Wallet";
import Container from "@mui/material/Container";
import { walletMap } from "./wallets";
import CloseIcon from "@mui/icons-material/Close";

export interface WalletDialogProps {
  open: boolean;
}

const ConnectWallet = () => {
  const { account } = useStarknet();
  const { available, connect, disconnect } = useConnectors();

  const [open, setOpen] = useState(false);

  const WalletDialog = (props: WalletDialogProps) => {
    const { open } = props;

    const handleWalletClick = (connector: Connector) => {
      connect(connector);
      setOpen(false);
    };

    return (
      <Dialog maxWidth="md" open={open}>
        <Container sx={{ minWidth: "30vw" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <DialogTitle>Connect a wallet</DialogTitle>
            <Button onClick={() => setOpen(false)}>
              <CloseIcon />
            </Button>
          </Box>

          <List sx={{ pt: 0 }}>
            {available.map((connector, i) => (
              <ListItemButton
                onClick={() => handleWalletClick(connector)}
                key={i}
              >
                {walletMap(connector.id())}
              </ListItemButton>
            ))}
          </List>
        </Container>
      </Dialog>
    );
  };

  if (account) {
    return (
      <Button onClick={() => disconnect()}>
        <WalletIcon />
        Disconnect
      </Button>
    );
  }
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <WalletIcon />
        Connect wallet
      </Button>
      <WalletDialog open={open} />
    </>
  );
};

export default ConnectWallet;
