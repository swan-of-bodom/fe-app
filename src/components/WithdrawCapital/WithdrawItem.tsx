import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";
import { debug } from "../../utils/debugger";
import { AccountInterface } from "starknet";
import { withdrawCall } from "./withdrawCall";
import { OptionType } from "../../types/options";

const handleWithdraw = async (
  account: AccountInterface,
  amount: number,
  type: OptionType,
  poolInfo: Object
) => {
  debug("Withdrawing", amount);
  debug("POOL INFO", poolInfo);
  withdrawCall(account, amount, type);
};

type Props = {
  account: AccountInterface;
  size: number;
  value: number;
  type: OptionType;
  poolInfo: Object;
};

export const WithdrawItem = ({
  account,
  size,
  value,
  type,
  poolInfo,
}: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const pool = type === OptionType.Call ? "Call" : "Put";

  return (
    <TableRow>
      <TableCell>{pool}</TableCell>
      <TableCell>{value}</TableCell>
      <TableCell>{size}</TableCell>
      <TableCell align="center">
        <TextField
          id="outlined-number"
          label="Amount"
          type="number"
          size="small"
          value={amount}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            maxLength: 20,
            step: "0.01",
            min: 0,
            max: 1000,
          }}
          onChange={(e) => {
            const valueIn = parseFloat(e.target.value);
            debug(valueIn);
            valueIn > size ? setAmount(size) : setAmount(valueIn);
          }}
        />
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          onClick={() => handleWithdraw(account, amount, type, poolInfo)}
        >
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};
