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

  return (
    <TableRow>
      <TableCell>{size}</TableCell>
      <TableCell>{value}</TableCell>
      <TableCell align="right">
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
            maxLength: 13,
            step: "0.01",
            min: 0,
            max: 50,
          }}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </TableCell>
      <TableCell align="right">
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
