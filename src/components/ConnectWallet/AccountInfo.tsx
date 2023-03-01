import { Button, Typography } from "@mui/material";
import { WalletIcon } from "../assets";
import { useWallet } from "../../hooks/useWallet";
import { openAccountDialog } from "../../redux/actions";
import { debug } from "../../utils/debugger";

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

  debug(wallet.icon);

  const handleClick = () => {
    openAccountDialog();
  };

  const { account } = wallet;
  const { address } = account;

  const letters = 5;
  const start = address.substring(0, letters);
  const end = address.substring(address.length - letters);

  return (
    <Button onClick={handleClick} variant="outlined" sx={containerStyle}>
      <>
        <WalletIcon sx={iconStyle} wallet={wallet} />
        <Typography>
          {start}...{end}
        </Typography>
      </>
    </Button>
  );
};
