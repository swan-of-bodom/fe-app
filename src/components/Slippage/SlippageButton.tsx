import { Button } from "@mui/material";
import { useSlippage } from "../../hooks/useSlippage";
import { openSlippageDialog } from "../../redux/actions";

export const SlippageButton = () => {
  const currentSlippage = useSlippage();

  return (
    <Button variant="contained" onClick={openSlippageDialog}>
      Slippage {currentSlippage}%
    </Button>
  );
};
