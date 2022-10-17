import {
  OptionIdentifier,
  OptionSide,
  OptionTradeArguments,
  OptionType,
} from "../types/options.d";
import { timestampToReadableDate, weiToEth } from "../utils/utils";
import { Button, Paper, styled, TextField } from "@mui/material";
import { approveAndTrade } from "../hooks/tradeOpen";
import { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";

type OptionPreviewProps = {
  option: OptionIdentifier;
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
}));

const handleBuy = async (
  account: AccountInterface | undefined,
  address: string | undefined,
  amount: string,
  option: OptionIdentifier,
  updateTradeState: (v: TradeState) => void
) => {
  if (!account || !address || !amount) {
    console.warn("Missing some of the inputs:", { account, address, amount });
    return;
  }
  updateTradeState({ failed: false, processing: true });
  const validatedOptionData: OptionTradeArguments = {
    ...option,
    optionSize: amount,
  };
  console.log("Buying option...");
  console.log(validatedOptionData);
  const res = await approveAndTrade(account, address, validatedOptionData);

  updateTradeState(
    res
      ? { failed: false, processing: false }
      : { failed: true, processing: false }
  );
};

export const OptionPreview = ({ option }: OptionPreviewProps) => {
  const { account, address } = useAccount();
  const [amount, setAmount] = useState("");
  const [tradeState, updateTradeState] = useState<TradeState>({
    failed: false,
    processing: false,
  });

  const { strikePrice, optionSide, optionType, maturity } = option;
  const msMaturity = maturity * 1000;

  if (msMaturity < new Date().getTime()) {
    return null;
  }

  const date = timestampToReadableDate(msMaturity);
  const typeText = optionType === OptionType.Put ? "put" : "call";
  const sideText = optionSide === OptionSide.Long ? "long" : "short";
  return (
    <Item>
      <span>{typeText}</span>
      <span>
        Strike price{" "}
        {strikePrice.length > 12 ? weiToEth(strikePrice, 2) : strikePrice}
      </span>
      <span>Maturity {date}</span>
      <TextField
        id="outlined-number"
        label="Amount Wei"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => setAmount(e.target.value)}
      />
      <span>{sideText}</span>
      <Button
        variant="contained"
        disabled={tradeState.processing}
        color={tradeState.failed ? "error" : "primary"}
        onClick={() =>
          handleBuy(account, address, amount, option, updateTradeState)
        }
      >
        $$$
      </Button>
    </Item>
  );
};
