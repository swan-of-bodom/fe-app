import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";
import { debug } from "../../utils/debugger";
import { AccountInterface } from "starknet";
import { withdrawCall } from "./withdrawCall";
import { OptionType } from "../../types/options";
import { handleNumericChangeFactory } from "../../utils/inputHandling";

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
  const [text, setText] = useState<string>("0");

  const cb = (n: number): number => (n >= size ? size : n);
  const handleChange = handleNumericChangeFactory(setText, setAmount, cb);

  const pool = type === OptionType.Call ? "Call" : "Put";

  return (
    <TableRow>
      <TableCell>{pool}</TableCell>
      <TableCell>{value}</TableCell>
      <TableCell>{size}</TableCell>
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
      <TableCell>
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
