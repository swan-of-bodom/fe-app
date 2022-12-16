import { Modal, Paper } from "@mui/material";
import { ModalContent } from "./Content";

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
  width: 600,
  height: 350,
  p: 4,
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
        <ModalContent />
      </Paper>
    </Modal>
  );
};
