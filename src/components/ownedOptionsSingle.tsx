import {
  OptionSide,
  OptionType,
  RawOption,
  RawOptionWithHighLow,
} from "../types/options";
import { timestampToReadableDate, weiToEth } from "../utils/utils";
import { Button, Chip, Paper, styled } from "@mui/material";
import { parseRawOption } from "../utils/parseOption";
import { debug } from "../utils/debugger";
import { tradeClose } from "../calls/tradeClose";
import { useAccount } from "@starknet-react/core";
import { AccountInterface } from "starknet";

type Props = {
  raw: RawOptionWithHighLow;
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

const handleTradeClose = async (
  account: AccountInterface | undefined,
  raw: RawOption,
  amount: number
) => {
  if (!account || !raw || !amount) {
    debug("Could not trade close", { account, raw, amount });
    return;
  }
  const res = await tradeClose(account, raw, amount);
  debug("Trade close", res);
};

export const SingleOwnedOption = ({ raw }: Props) => {
  const { account } = useAccount();
  const { low, high } = raw.high_low;
  const v: number = Math.max(low, high);

  const option = parseRawOption(raw);

  const { strikePrice, optionSide, optionType, maturity } = option;
  const msMaturity = maturity * 1000;

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
      <Chip label={sideText} color="info" />

      <span>Balance: {v} Wei</span>

      <Button
        variant="contained"
        onClick={() => handleTradeClose(account, raw, v)}
      >
        Sell!
      </Button>
    </Item>
  );
};
