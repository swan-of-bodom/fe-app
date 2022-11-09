import { Button, TableCell, TableRow, TextField } from "@mui/material";
import BN from "bn.js";
import { useState } from "react";
import {
  AMM_METHODS,
  ETH_BASE_VALUE,
  getTokenAddresses,
} from "../../constants/amm";
import { debug } from "../../utils/debugger";
import { Abi, AccountInterface } from "starknet";
import LpAbi from "../../abi/lptoken_abi.json";
import AmmAbi from "../../abi/amm_abi.json";
import { OptionType } from "../../types/options";

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

const precission = 1000;

const handleStake = async (account: AccountInterface, amount: number) => {
  debug("Staking", amount);
  const wei = new BN(amount * precission)
    .mul(ETH_BASE_VALUE)
    .div(new BN(precission))
    .toString(16);

  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const approveCalldata = {
    contractAddress: ETH_ADDRESS,
    entrypoint: AMM_METHODS.APPROVE,
    calldata: [MAIN_CONTRACT_ADDRESS, "0x" + wei, 0],
  };

  debug("Approve call", approveCalldata);

  const approveRes = await account.execute(approveCalldata, [LpAbi] as Abi[]);

  debug("Stake deposit approved", approveRes);

  const depositLiquidityCalldata = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.DEPOSIT_LIQUIDITY,
    calldata: [
      ETH_ADDRESS, // ETH pro call pool , USD pro put pool
      USD_ADDRESS,
      ETH_ADDRESS,
      OptionType.Call,
      "0x" + wei,
      0,
    ],
  };
  debug("Depositing liquidity", depositLiquidityCalldata);
  const depositRes = await account.execute(depositLiquidityCalldata, [
    AmmAbi,
  ] as Abi[]);
  debug("Deposit liquidity res", depositRes);
};

type Props = {
  account: AccountInterface;
  type: OptionType;
};

export const StakeCapitalItem = ({ account, type }: Props) => {
  const [amount, setAmount] = useState<number>(0);

  const poolName = type === OptionType.Call ? "Call Pool" : "Put Pool";

  return (
    <TableRow>
      <TableCell>{poolName}</TableCell>
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
          onClick={() => handleStake(account, amount)}
        >
          Stake
        </Button>
      </TableCell>
    </TableRow>
  );
};
