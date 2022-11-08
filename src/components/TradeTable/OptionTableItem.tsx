import {
  CompositeOption,
  OptionType,
  ParsedCallOption,
  ParsedPutOption,
} from "../../types/options";
import { timestampToReadableDate, weiToEth } from "../../utils/utils";
import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { approveAndTrade } from "../../calls/tradeOpen";
import { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { debug, LogTypes } from "../../utils/debugger";
import { Float } from "../../types/base";
import BN from "bn.js";

type OptionPreviewProps = {
  option: CompositeOption;
};

type TradeState = {
  failed: boolean;
  processing: boolean;
};

const handleBuy = async (
  account: AccountInterface | undefined,
  amount: Float,
  option: CompositeOption,
  updateTradeState: (v: TradeState) => void
) => {
  if (!account || !amount) {
    debug(LogTypes.WARN, "Missing some of the inputs:", { account, amount });
    return;
  }
  updateTradeState({ failed: false, processing: true });

  const res = await approveAndTrade(account, option, amount);

  updateTradeState(
    res
      ? { failed: false, processing: false }
      : { failed: true, processing: false }
  );
};

const OptionTableItem = ({ option }: OptionPreviewProps) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState<number>(0.0);
  const [tradeState, updateTradeState] = useState<TradeState>({
    failed: false,
    processing: false,
  });

  const { strikePrice, maturity, optionType } = option.parsed;
  const msMaturity = maturity * 1000;

  const date = timestampToReadableDate(msMaturity);

  return (
    <TableRow>
      <TableCell>${strikePrice}</TableCell>
      <TableCell align="right">{date}</TableCell>
      <TableCell align="right">
        {" "}
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
          variant="contained"
          disabled={tradeState.processing || !account}
          color={tradeState.failed ? "error" : "primary"}
          onClick={() => handleBuy(account, amount, option, updateTradeState)}
        >
          {optionType === OptionType.Call
            ? `ETH ${weiToEth(
                new BN((option.parsed as ParsedCallOption).premiaWei as string),
                4
              )}`
            : `USD ${(option.parsed as ParsedPutOption).premiaUsd}`}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default OptionTableItem;
