import { Modal, Paper, useTheme } from "@mui/material";
import { OptionWithPremia } from "../../classes/Option";
import { isDarkTheme } from "../../utils/utils";
import { TradeCard } from "./TradeCard";

type ModalProps = {
  open: boolean;
  setOpen: (b: boolean) => void;
  option: OptionWithPremia;
};

export const OptionModal = ({ open, setOpen, option }: ModalProps) => {
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: 2,
    minWidth: "min(500px, 95vw)",
    background: isDarkTheme(theme) ? "black" : "white",
    border: `solid 1px ${theme.palette.primary.main}`,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="buy option modal"
      aria-describedby="set amount and buy"
    >
      <Paper sx={style} elevation={2}>
        <TradeCard option={option} />
      </Paper>
    </Modal>
  );
};
