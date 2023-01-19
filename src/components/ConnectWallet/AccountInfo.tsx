import { Button, Tooltip, Typography } from "@mui/material";
import { Connector } from "@starknet-react/core";
import { SupportedWalletIds } from "../../types/wallet";
import { ArgentIcon, BraavosIcon } from "../assets";

type AccountInfoProps = {
  connector: Connector;
  address: string;
  disconnect: () => void;
};

const iconStyle = {
  width: 30,
  marginRight: 1,
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
};

export const AccountInfo = ({
  connector,
  address,
  disconnect,
}: AccountInfoProps) => {
  const { id } = connector.options;

  const letters = 5;
  const start = address.substring(0, letters);
  const end = address.substring(address.length - letters);

  return (
    <Tooltip title={"Disconnect"}>
      <Button onClick={disconnect} variant="outlined" sx={containerStyle}>
        <>
          {id === SupportedWalletIds.ArgentX && <ArgentIcon sx={iconStyle} />}
          {id === SupportedWalletIds.Braavos && <BraavosIcon sx={iconStyle} />}
          <Typography>
            {start}...{end}
          </Typography>
        </>
      </Button>
    </Tooltip>
  );
};
