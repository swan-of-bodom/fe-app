import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";
import { debug } from "../../utils/debugger";
import { AccountInterface } from "starknet";

/*

func deposit_liquidity{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    pooled_token_addr: Address,
    quote_token_address: Address,
    base_token_address: Address,
    option_type: OptionType,
    amount: Uint256
) {
pro call ETH, USD, ETH, 0, AMOUNT_in_wei
pro put USD, USD, ETH, 0, AMOUNT_in_usd_base

*/

const handleWithdraw = async (account: AccountInterface, amount: number) => {
  debug("Withdrawing", amount);
};

type Props = {
  account: AccountInterface;
  size: number;
  value: number;
};

export const WithdrawItem = ({ account, size, value }: Props) => {
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
          onClick={() => handleWithdraw(account, amount)}
        >
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};
