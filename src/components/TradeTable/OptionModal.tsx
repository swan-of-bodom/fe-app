import { Modal, useTheme } from "@mui/material";
import { OptionWithPremia } from "../../classes/Option";
import { TradeCard } from "./TradeCard";
import style from "./modal.module.css";

type ModalProps = {
  open: boolean;
  setOpen: (b: boolean) => void;
  option: OptionWithPremia;
};

export const OptionModal = ({ open, setOpen, option }: ModalProps) => {
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const _style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: 2,
    minWidth: "min(500px, 95vw)",
    background: "black",
    border: `solid 1px ${theme.palette.primary.main}`,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="buy option modal"
      aria-describedby="set amount and buy"
    >
      <div className={style.container}>
        <TradeCard option={option} />
      </div>
    </Modal>
  );
};
