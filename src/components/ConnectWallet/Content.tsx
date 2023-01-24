import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { useState } from "react";
import { ArgentIcon, BraavosIcon } from "../assets";
import { SupportedWalletIds } from "../../types/wallet";
import { connect } from "../../network/account";
import { debug } from "../../utils/debugger";
import { getStarknet } from "get-starknet-core";

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
    <Typography variant="h5">What is a wallet?</Typography>
    <Typography>
      To interact with StarkNet, you will need to deploy an account contract.
      StarkNet account is represented by a deployed contract that defines the
      account’s logic.
      <br />
      These contracts can be governed and used with a Wallet.
    </Typography>
  </Box>
);

const ArgentBox = () => (
  <Box sx={walletBoxStyle}>
    <Typography variant="h5">ArgentX</Typography>
    <Typography>
      Every account is a smart contract with built-in multicall. Thanks to
      account abstraction, unlock new use cases and leverage the true potential
      of blockchains.
      <br />
      <Link target="_blank" href="https://www.argent.xyz/argent-x/">
        Find out more about ArgentX!
      </Link>
    </Typography>
  </Box>
);

const BraavosBox = () => (
  <Box sx={walletBoxStyle}>
    <Typography variant="h5">Braavos</Typography>
    <Typography>
      A smart contract based wallet fully focused on StarkNet with innovative
      features and beautiful UX.
      <br />
      Available for all major browsers, as well as Android and iOS.
      <br />
      <Link target="_blank" href="https://braavos.app/download/">
        Download Braavos
      </Link>
    </Typography>
  </Box>
);

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

  const handleClick = async (id: SupportedWalletIds, activeBox: ActiveBox) => {
    const sn = getStarknet();
    const available = await sn.getAvailableWallets();
    const connector = available.find((wallet) => wallet.id === id);

    debug("Connector", connector);

    if (connector) {
      return connect(connector);
    }

    setActiveBox(activeBox);
  };

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
            onClick={() =>
              handleClick(SupportedWalletIds.ArgentX, ActiveBox.argent)
            }
          >
            <ArgentIcon sx={iconStyle} /> ArgentX
          </Button>
          <Button
            sx={buttonStyle}
            onClick={() =>
              handleClick(SupportedWalletIds.Braavos, ActiveBox.braavos)
            }
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
