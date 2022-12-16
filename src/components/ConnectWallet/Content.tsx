import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { useConnectors } from "@starknet-react/core";
import { isNonEmptyArray } from "../../utils/utils";
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
  marginTop: 2,
  marginBottom: 4,
};

export const ModalContent = () => {
  const { available } = useConnectors();

  if (isNonEmptyArray(available)) {
    return <WalletBox />;
  }

  return <p>Nasrat</p>;
};

const DefaultBox = () => (
  <Box sx={walletBoxStyle}>
    <Typography variant="h6">What is a wallet?</Typography>
    <br />
    <Typography>
      StakNet allows you to lorem ipsum walletsum whatevsum...
    </Typography>
  </Box>
);

const ArgentBox = () => {
  const { available, connect } = useConnectors();

  const isAvailable = available.find(
    (wallets) => wallets?.options?.id === SupportedWalletIds.ArgentX
  );

  return (
    <Box sx={walletBoxStyle}>
      <Link href="https://www.argent.xyz/argent-x/">Checkout ArgentX</Link>

      <br />
      {isAvailable && (
        <Button variant="contained" onClick={() => connect(isAvailable)}>
          Connect
        </Button>
      )}
    </Box>
  );
};

const BraavosBox = () => {
  const { available, connect } = useConnectors();

  const isAvailable = available.find(
    (wallets) => wallets?.options?.id === SupportedWalletIds.Braavos
  );
  return (
    <Box sx={walletBoxStyle}>
      <Link href="https://braavos.app/">Checkout Braavos</Link>

      <br />

      {isAvailable && (
        <Button variant="contained" onClick={() => connect(isAvailable)}>
          Connect
        </Button>
      )}
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

const WalletBox = () => {
  const [activeBox, setActiveBox] = useState<ActiveBox>(ActiveBox.default);
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Typography
          sx={{ cursor: "pointer" }}
          onClick={() => setActiveBox(ActiveBox.default)}
          variant="h6"
        >
          Connect a Wallet
        </Typography>
      </Grid>
      <Grid item xs={8}></Grid>

      <Grid item xs={4}>
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
      <Grid item xs={8}>
        <BoxSwitch variant={activeBox} />
      </Grid>
    </Grid>
  );
};
