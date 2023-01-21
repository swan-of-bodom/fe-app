import { Button, Tooltip, Typography } from "@mui/material";
import { SupportedWalletIds } from "../../types/wallet";
import { ArgentIcon, BraavosIcon } from "../assets";
import { useWallet } from "../../hooks/useWallet";
import { disconnect } from "../../network/account";
import { closeWalletConnectDialog } from "../../redux/actions";

const iconStyle = {
  width: 30,
  marginRight: 1,
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
};

export const AccountInfo = () => {
  const wallet = useWallet();

  if (!wallet) {
    return null;
  }

  const handleDisconnect = () => {
    disconnect();
    closeWalletConnectDialog();
  };

  const { account, id } = wallet;
  const { address } = account;

  const letters = 5;
  const start = address.substring(0, letters);
  const end = address.substring(address.length - letters);

  return (
    <Tooltip title={"Disconnect"}>
      <Button onClick={handleDisconnect} variant="outlined" sx={containerStyle}>
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
