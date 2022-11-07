import { CompositeOption, RawOption } from "../../types/options";
import { timestampToReadableDate } from "../../utils/utils";
import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { approveAndTrade } from "../../calls/tradeOpen";
import { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { debug, LogTypes } from "../../utils/debugger";
import { Float } from "../../types/base";

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
  rawOption: RawOption,
  updateTradeState: (v: TradeState) => void
) => {
  if (!account || !amount) {
    debug(LogTypes.WARN, "Missing some of the inputs:", { account, amount });
    return;
  }
  updateTradeState({ failed: false, processing: true });

  const res = await approveAndTrade(account, rawOption, amount);

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

  const { strikePrice, maturity, premiaUsd } = option.parsed;
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
          onClick={() =>
            handleBuy(account, amount, option.raw, updateTradeState)
          }
        >
          ${premiaUsd}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default OptionTableItem;
