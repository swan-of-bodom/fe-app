import { Modal } from "@mui/material";
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
