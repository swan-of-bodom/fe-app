import { Modal, Paper } from "@mui/material";
import { WalletBox } from "./Content";

type Props = {
  open: boolean;
  setOpen: (b: boolean) => void;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  margin: 2,
  padding: 2,
  maxWidth: 600,
  minWidth: 300,
};

export const WalletModal = ({ open, setOpen }: Props) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="wallet connection modal"
      aria-describedby="choose a wallet and connect to it"
    >
      <Paper sx={style} elevation={2}>
        <WalletBox />
      </Paper>
    </Modal>
  );
};
