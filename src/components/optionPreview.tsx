import { OptionSide, OptionType, RawOption } from "../types/options.d";
import { timestampToReadableDate, weiToEth } from "../utils/utils";
import { Button, Chip, Paper, styled, TextField } from "@mui/material";
import { approveAndTrade } from "../hooks/tradeOpen";
import { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { parseRawOption } from "../utils/parseOption";
import { debug, LogTypes } from "../utils/debugger";

type OptionPreviewProps = {
  rawOption: RawOption;
};

type TradeState = {
  failed: boolean;
  processing: boolean;
};

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

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

export const OptionPreview = ({ rawOption }: OptionPreviewProps) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState("");
  const [tradeState, updateTradeState] = useState<TradeState>({
    failed: false,
    processing: false,
  });

  const option = parseRawOption(rawOption);

  if (!option) {
    return null;
  }

  const { strikePrice, optionSide, optionType, maturity } = option;
  const msMaturity = maturity * 1000;

  if (msMaturity < new Date().getTime()) {
    return null;
  }

  const date = timestampToReadableDate(msMaturity);
  const typeText = optionType === OptionType.Put ? "Put" : "Call";
  const sideText = optionSide === OptionSide.Long ? "Long" : "Short";
  return (
    <Item elevation={4}>
      <Chip label={typeText} color="info" />
      <span>
        Strike price{" "}
        {strikePrice.length > 12 ? weiToEth(strikePrice, 2) : strikePrice}
      </span>
      <span>Maturity {date}</span>
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
      <Chip label={sideText} color="info" />
      <Button
        variant="contained"
        disabled={tradeState.processing || !account}
        color={tradeState.failed ? "error" : "primary"}
        onClick={() => handleBuy(account, amount, rawOption, updateTradeState)}
      >
        $$$
      </Button>
    </Item>
  );
};
