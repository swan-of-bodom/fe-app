import {
  Box,
  Button,
  IconButton,
  Link,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useWallet } from "../../hooks/useWallet";
import { disconnect } from "../../network/account";
import { closeDialog, showToast } from "../../redux/actions";
import { WalletIcon } from "../assets";
import { ContentCopy, Info, PowerSettingsNew } from "@mui/icons-material";
import { ToastType } from "../../redux/reducers/ui";
import { RecentTransaction } from "./RecentTransactions";
import { addressElision, getStarkscanUrl } from "../../utils/utils";

const handleDisconnect = () => {
  closeDialog();
  disconnect();
};

const handleCopy = (msg: string) => {
  navigator.clipboard
    .writeText(msg)
    .then(() => showToast("Address copied!"))
    .catch(() => showToast("Failed to copy", ToastType.Warn));
};

const iconStyle = {
  width: 30,
  marginRight: 1,
};

export const WalletInfo = () => {
  const wallet = useWallet();

  if (!wallet) {
    return <Skeleton width={256} height={88} />;
  }

  const { account } = wallet;
  const { address } = account;
  const exploreUrl = getStarkscanUrl({
    chainId: wallet.account.chainId,
    contractHash: address,
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title={address}>
          <Button variant="outlined" onClick={() => handleCopy(address)}>
            <WalletIcon sx={iconStyle} wallet={wallet} />

            <Typography>{addressElision(address)}</Typography>
          </Button>
        </Tooltip>

        <Tooltip title="Copy address">
          <IconButton onClick={() => handleCopy(address)}>
            <ContentCopy />
          </IconButton>
        </Tooltip>

        <Tooltip title="Explore">
          <Link target="_blank" href={exploreUrl} rel="noreferrer">
            <IconButton>
              <Info />
            </IconButton>
          </Link>
        </Tooltip>

        <Tooltip title="Disconnect">
          <IconButton onClick={handleDisconnect}>
            <PowerSettingsNew />
          </IconButton>
        </Tooltip>
      </Box>
      <br />
      <Typography variant="h6">Recent transactions</Typography>
      <br />
      <RecentTransaction />
    </>
  );
};
