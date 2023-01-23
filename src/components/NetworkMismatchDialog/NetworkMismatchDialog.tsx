import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  Paper,
} from "@mui/material";
import { useNetworkMismatchDialogOpen } from "../../hooks/useNetworkMismatchDialogOpen";
import { closeNetworkMismatchDialog } from "../../redux/actions";
import { isDarkTheme } from "../../utils/utils";

export const NetworkMismatchDialog = () => {
  const open = useNetworkMismatchDialogOpen();
  const theme = useTheme();

  const style = {
    padding: 2,
    background: isDarkTheme(theme) ? "black" : "white",
    border: `solid 1px ${theme.palette.primary.main}`,
    color: `${theme.palette.primary.main}`,
  };

  return (
    <Dialog
      open={open}
      onClose={closeNetworkMismatchDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Paper sx={style}>
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
          <Button
            variant="contained"
            onClick={closeNetworkMismatchDialog}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Paper>
    </Dialog>
  );
};
