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
          Your wallet is on different Network than the dApp
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please, either change the network that the dApp is using, or the
            network that your wallet is using.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNetworkMismatchDialog} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Paper>
    </Dialog>
  );
};
