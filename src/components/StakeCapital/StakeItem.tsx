import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";
import { AccountInterface } from "starknet";
import { OptionType } from "../../types/options";
import { handleStake } from "./handleStake";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { isCall } from "../../utils/utils";
import { POOL_NAMES } from "../../constants/texts";

type Props = {
  account: AccountInterface;
  type: OptionType;
};

export const StakeCapitalItem = ({ account, type }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [text, setText] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = handleNumericChangeFactory(setText, setAmount);

  const poolName = isCall(type) ? POOL_NAMES.CALL : POOL_NAMES.PUT;

  return (
    <TableRow>
      <TableCell>{poolName}</TableCell>
      <TableCell sx={{ minWidth: "100px" }} align="center">
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
        <Button
          disabled={loading}
          variant="contained"
          onClick={() => handleStake(account, amount, type, setLoading)}
        >
          {loading ? "Processing..." : "Stake"}
        </Button>
      </TableCell>
    </TableRow>
  );
};
