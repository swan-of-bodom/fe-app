import { OptionSide, OptionType, RawOptionWithHighLow } from "../types/options";
import { timestampToReadableDate, weiToEth } from "../utils/utils";
import { Chip, Paper, styled } from "@mui/material";
import { parseRawOption } from "../utils/parseOption";

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

export const SingleOwnedOption = ({ raw }: Props) => {
  const { low, high } = raw.high_low;
  const v: number = Math.max(low, high);

  if (v === 0) {
    return null;
  }
  const option = parseRawOption(raw);
  if (!option) {
    return null;
  }

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

      <span>Balance {v}</span>
    </Item>
  );
};
