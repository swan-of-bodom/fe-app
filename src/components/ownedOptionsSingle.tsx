import {
  OptionSide,
  OptionType,
  RawOption,
  RawOptionWithBalance,
} from "../types/options";
import { timestampToReadableDate, weiToEth } from "../utils/utils";
import { Button, Paper, styled } from "@mui/material";
import { bnToInt, parseRawOption } from "../utils/parseOption";
import { debug } from "../utils/debugger";
import { tradeClose } from "../calls/tradeClose";
import { useAccount } from "@starknet-react/core";
import { AccountInterface } from "starknet";

type Props = {
  raw: RawOptionWithBalance;
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
  const balance = bnToInt(raw.balance);

  const option = parseRawOption(raw);

  const { strikePrice, optionSide, optionType, maturity } = option;
  const msMaturity = maturity * 1000;

  const date = timestampToReadableDate(msMaturity);
  const typeText = optionType === OptionType.Put ? "Put" : "Call";
  const sideText = optionSide === OptionSide.Long ? "Long" : "Short";

  const desc = `${sideText} ${typeText} with strike $${strikePrice}`;

  return (
    <Item elevation={4}>
      <span>{desc}</span>
      <span>Maturity {date}</span>
      <span>Balance: {weiToEth(balance, 8)} ETH</span>

      <Button
        variant="contained"
        onClick={() => handleTradeClose(account, raw, balance)}
      >
        Sell!
      </Button>
    </Item>
  );
};
