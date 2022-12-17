import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { useConnectors } from "@starknet-react/core";
import { useState } from "react";
import { ArgentIcon, BraavosIcon } from "../assets";
import { SupportedWalletIds } from "../../types/wallet";

enum ActiveBox {
  default,
  argent,
  braavos,
}

type BoxSwitchProps = {
  variant: ActiveBox;
};

const buttonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
};

const iconStyle = {
  width: 30,
  marginRight: 2,
};

const walletBoxStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexFlow: "column",
  textAlign: "center",
  marginBottom: 4,
};

const DefaultBox = () => (
  <Box sx={walletBoxStyle}>
    <Typography variant="h6">What is a wallet?</Typography>
    <br />
    <Typography>StarkNet wallets are themselves SmartContracts.</Typography>
  </Box>
);

const ArgentBox = () => {
  const { available, connect } = useConnectors();

  const connector = available.find(
    (wallets) => wallets?.options?.id === SupportedWalletIds.ArgentX
  );

  if (connector) {
    return (
      <Box sx={walletBoxStyle}>
        <Typography>
          There is an ArgentX wallet associated with this browser.
        </Typography>
        <br />
        <Button variant="contained" onClick={() => connect(connector)}>
          <ArgentIcon sx={iconStyle} />
          Connect to ArgentX
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={walletBoxStyle}>
      <Typography variant="h6">Get ArgentX</Typography>
      <Typography>
        Every account is a smart contract with built-in multicall. Thanks to
        account abstraction, unlock new use cases and leverage the true
        potential of blockchains. <br />
        <Link target="_blank" href="https://www.argent.xyz/argent-x/">
          Find out more about ArgentX!
        </Link>
      </Typography>
    </Box>
  );
};

const BraavosBox = () => {
  const { available, connect } = useConnectors();

  const connector = available.find(
    (wallets) => wallets?.options?.id === SupportedWalletIds.Braavos
  );

  if (connector) {
    return (
      <Box sx={walletBoxStyle}>
        <Typography>
          There is a Braavos wallet associated with this browser.
        </Typography>
        <br />
        <Button variant="contained" onClick={() => connect(connector)}>
          <BraavosIcon sx={iconStyle} />
          Connect to Braavos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={walletBoxStyle}>
      <Typography variant="h6">Get Braavos</Typography>
      <Typography>
        The next generation of wallets made for an intuitive and safe start in
        crypto. Buy, store, and send Manage your tokens wherever you are with a
        single app.
        <br />
        <Link target="_blank" href="https://braavos.app/">
          Find out more about Braavos
        </Link>
      </Typography>
    </Box>
  );
};

const BoxSwitch = ({ variant }: BoxSwitchProps) => {
  switch (variant) {
    case ActiveBox.argent:
      return <ArgentBox />;
    case ActiveBox.braavos:
      return <BraavosBox />;
    default:
      return <DefaultBox />;
  }
};

export const WalletBox = () => {
  const [activeBox, setActiveBox] = useState<ActiveBox>(ActiveBox.default);
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography
          sx={{ cursor: "pointer" }}
          onClick={() => setActiveBox(ActiveBox.default)}
          variant="h6"
        >
          Connect a Wallet
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            alignItems: "baseline",
          }}
        >
          <Button
            sx={buttonStyle}
            onClick={() => setActiveBox(ActiveBox.argent)}
          >
            <ArgentIcon sx={iconStyle} /> ArgentX
          </Button>
          <Button
            sx={buttonStyle}
            onClick={() => setActiveBox(ActiveBox.braavos)}
          >
            <BraavosIcon sx={iconStyle} /> Braavos
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <BoxSwitch variant={activeBox} />
      </Grid>
    </Grid>
  );
};
