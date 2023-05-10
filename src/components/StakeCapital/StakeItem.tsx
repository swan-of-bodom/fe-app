import { Button, TableCell, TableRow, TextField, Tooltip } from "@mui/material";
import { useState } from "react";
import { AccountInterface } from "starknet";
import { OptionType } from "../../types/options";
import { handleStake } from "./handleStake";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { isCall } from "../../utils/utils";
import { POOL_NAMES } from "../../constants/texts";
import { openCallWidoDialog, openPutWidoDialog } from "../../redux/actions";

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
  const handleWidoClick = () => {
    isCall(type) ? openCallWidoDialog() : openPutWidoDialog();
  };

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
        <Tooltip title="Stake from L1 directly to our liquidity pool - requires MetaMask">
          <Button sx={{ ml: 1 }} variant="contained" onClick={handleWidoClick}>
            Stake from L1
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
