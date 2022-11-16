import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";
import { AccountInterface } from "starknet";
import { OptionType } from "../../types/options";
import { handleStake } from "./handleStake";

type Props = {
  account: AccountInterface;
  type: OptionType;
};

export const StakeCapitalItem = ({ account, type }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const poolName =
    type === OptionType.Call ? "Call Pool (ETH)" : "Put Pool (USD)";

  return (
    <TableRow>
      <TableCell>{poolName}</TableCell>
      <TableCell align="right">
        <TextField
          id="outlined-number"
          label="Amount"
          type="number"
          size="small"
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
          disabled={loading}
          variant="contained"
          onClick={() => handleStake(account, amount, setLoading)}
        >
          {loading ? "Processing..." : "Stake"}
        </Button>
      </TableCell>
    </TableRow>
  );
};
