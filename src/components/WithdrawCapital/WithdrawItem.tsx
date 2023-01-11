import {
  Button,
  ButtonGroup,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AccountInterface } from "starknet";
import { withdrawCall } from "./withdrawCall";
import { OptionType } from "../../types/options";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { digitsByType, isCall } from "../../utils/utils";
import { ETH_DIGITS, USD_DIGITS } from "../../constants/amm";
import { shortInteger } from "../../utils/computations";
import { Uint256, uint256ToBN } from "starknet/dist/utils/uint256";
import { decimalToUint256 } from "../../utils/units";

type Props = {
  account: AccountInterface;
  size: Uint256;
  value: Uint256;
  type: OptionType;
};

export const WithdrawItem = ({ account, size, value, type }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [text, setText] = useState<string>("0");
  const [processing, setProcessing] = useState<boolean>(false);

  const digits = isCall(type) ? ETH_DIGITS : USD_DIGITS;
  const [decimalSize, decimalValue] = [
    shortInteger(uint256ToBN(size).toString(10), digits),
    shortInteger(uint256ToBN(value).toString(10), digits),
  ];

  const cb = (n: number): number => (n >= decimalSize ? decimalSize : n);
  const handleChange = handleNumericChangeFactory(setText, setAmount, cb);
  const handleWithdraw = () =>
    withdrawCall(
      account,
      setProcessing,
      type,
      decimalToUint256(amount, digitsByType(type))
    );
  const handleWithdrawAll = () =>
    withdrawCall(account, setProcessing, type, size);

  const pool = type === OptionType.Call ? "Call" : "Put";

  const displayDigits = 5;
  const displayValue = Number(Number(decimalValue).toFixed(displayDigits));
  const displaySize = Number(Number(decimalSize).toFixed(displayDigits));

  return (
    <TableRow>
      <TableCell>{pool}</TableCell>
      <TableCell>
        <Tooltip title={decimalValue === displayValue ? "" : decimalValue}>
          <Typography>{displayValue}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip title={decimalSize === displaySize ? "" : decimalSize}>
          <Typography>{displaySize}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ minWidth: "100px" }}>
        <TextField
          id="outlined-number"
          label="Amount"
          size="small"
          value={text}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            inputMode: "decimal",
          }}
          onChange={handleChange}
        />
      </TableCell>
      <TableCell align="right">
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled elevation buttons"
          disabled={processing}
        >
          {processing ? (
            <Button>Processing...</Button>
          ) : (
            <>
              <Button onClick={handleWithdraw}>Withdraw</Button>
              <Button onClick={handleWithdrawAll}>Max</Button>
            </>
          )}
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};
