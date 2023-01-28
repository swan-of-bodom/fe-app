import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useSlippage } from "../../hooks/useSlippage";
import { setSlippage } from "../../redux/actions";
import { ChangeEvent, useState } from "react";
import { debug } from "../../utils/debugger";

export const SlippageContent = () => {
  const currentSlippage = useSlippage();
  const [inputText, setInputText] = useState<string>(String(currentSlippage));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const valueIn = e.target.value.replace(",", ".");

    debug("Value in", valueIn);

    // smallest allowed number is 0.01
    // it is later converted to basis points
    // 0.01% -> 1 basis point
    if (!/^\d*\.{0,1}\d{0,2}$/.test(valueIn)) {
      return;
    }

    const parsed = parseFloat(valueIn);

    debug("Parsed", parsed);

    // max allowed number: 25
    if (parsed > 25) {
      return;
    }

    if (valueIn === ".") {
      setInputText("0.");
      setSlippage(0);
      return;
    }

    if (valueIn === "" || isNaN(parsed)) {
      setInputText("");
      setSlippage(0);
      return;
    }

    setInputText(valueIn);
    setSlippage(parsed);
  };

  const handleClick = (n: number) => {
    setSlippage(n);
    setInputText(String(n));
  };

  return (
    <>
      <Typography sx={{ m: 2 }} variant="h6">
        Slippage tolerance {currentSlippage}%
      </Typography>
      <Divider variant="middle" />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          id="slippage-input"
          label="Slippage %"
          type="numeric"
          size="small"
          value={inputText}
          autoFocus
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            inputMode: "decimal",
          }}
          sx={{ m: 2 }}
          onChange={handleChange}
        />
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button onClick={() => handleClick(1)}>1%</Button>
          <Button onClick={() => handleClick(5)}>5%</Button>
          <Button onClick={() => handleClick(10)}>10%</Button>
        </ButtonGroup>
      </Box>
      {currentSlippage === 0 && <Typography>Transaction may fail</Typography>}
    </>
  );
};
