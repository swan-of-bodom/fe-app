import {
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Paper,
  Button,
  DialogActions,
  DialogContentText,
  IconButton,
  Link,
} from "@mui/material";
import { isDarkTheme } from "../../utils/utils";
import { useDialog } from "../../hooks/useDialog";
import { closeDialog } from "../../redux/actions";
import { DialogContentElem } from "../../redux/reducers/ui";
import { WalletBox } from "../ConnectWallet/Content";
import { SlippageContent } from "../Slippage/SlippageContent";
import { Close } from "@mui/icons-material";
import { ClosePosition } from "../ClosePosition/ClosePosition";
import { WalletInfo } from "../WalletInfo/WalletInfo";
import { CallWido, PutWido } from "../WidoWidgetWrapper/WidoWidgetWrapper";

const NetworkMismatch = () => (
  <>
    <DialogTitle id="alert-dialog-title">
      Wallet - dApp network mismatch
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Your wallet appears to be connected to a different network than this
        application. Please ensure that your wallet is connected to the same
        network as the app, or change the network that the app is using, in
        order to proceed.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="contained" onClick={closeDialog} autoFocus>
        Close
      </Button>
    </DialogActions>
  </>
);

const MetamaskMissing = () => (
  <>
    <DialogTitle id="alert-dialog-title">Metamask wallet not found</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        It appears that you do not have the Metamask wallet installed in your
        browser.
        <br />
        In order to stake using Wido, it is necessary to have the Metamask
        wallet.
        <br />
        To install it, please follow the instructions provided at{" "}
        <Link target="_blank" href="https://metamask.io/">
          metamask.io
        </Link>
        .
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="contained" onClick={closeDialog} autoFocus>
        Close
      </Button>
    </DialogActions>
  </>
);

type CustomDialogTitleProps = {
  title: string;
};

export const CustomDialogTitle = ({ title }: CustomDialogTitleProps) => (
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      p: 0,
      pb: 2,
    }}
  >
    {title}
    <IconButton
      aria-label="close"
      onClick={closeDialog}
      sx={{
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>
);

export const MultiDialog = () => {
  const { dialogOpen, dialogContent } = useDialog();
  const theme = useTheme();

  const style = {
    p: 1,
    background: isDarkTheme(theme) ? "black" : "white",
    border: `solid 1px ${theme.palette.primary.main}`,
    overflow: "hidden",
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Paper sx={style}>
        {dialogContent === DialogContentElem.NetworkMismatch && (
          <NetworkMismatch />
        )}
        {dialogContent === DialogContentElem.Slippage && <SlippageContent />}
        {dialogContent === DialogContentElem.Wallet && <WalletBox />}
        {dialogContent === DialogContentElem.CloseOption && <ClosePosition />}
        {dialogContent === DialogContentElem.Account && <WalletInfo />}
        {dialogContent === DialogContentElem.CallWido && <CallWido />}
        {dialogContent === DialogContentElem.PutWido && <PutWido />}
        {dialogContent === DialogContentElem.MetamaskMissing && (
          <MetamaskMissing />
        )}
      </Paper>
    </Dialog>
  );
};
