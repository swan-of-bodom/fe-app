import { DialogContent, DialogTitle } from "@mui/material";
import { useSlippage } from "../../hooks/useSlippage";

export const SlippageContent = () => {
  const currentSlippage = useSlippage();

  return (
    <>
      <DialogTitle id="alert-dialog-title">Set slippage</DialogTitle>
      <DialogContent>{currentSlippage}%</DialogContent>
    </>
  );
};
