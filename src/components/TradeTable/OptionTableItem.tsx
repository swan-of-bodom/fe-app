import { CompositeOption, RawOption } from "../../types/options";
import { timestampToReadableDate } from "../../utils/utils";
import { Button, TableCell, TableRow, TextField } from "@mui/material";
import { approveAndTrade } from "../../calls/tradeOpen";
import { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { debug, LogTypes } from "../../utils/debugger";

type OptionPreviewProps = {
  option: CompositeOption;
};

type TradeState = {
  failed: boolean;
  processing: boolean;
};

const handleBuy = async (
  account: AccountInterface | undefined,
  amount: string,
  rawOption: RawOption,
  updateTradeState: (v: TradeState) => void
) => {
  if (!account || !amount) {
    debug(LogTypes.WARN, "Missing some of the inputs:", { account, amount });
    return;
  }
  updateTradeState({ failed: false, processing: true });

  const res = await approveAndTrade(account, rawOption, parseInt(amount, 10));

  updateTradeState(
    res
      ? { failed: false, processing: false }
      : { failed: true, processing: false }
  );
};

const OptionTableItem = ({ option }: OptionPreviewProps) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState("");
  const [tradeState, updateTradeState] = useState<TradeState>({
    failed: false,
    processing: false,
  });

  const { strikePrice, maturity } = option.parsed;
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
          label="Amount Wei"
          type="number"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setAmount(e.target.value)}
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
          Buy!
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default OptionTableItem;
