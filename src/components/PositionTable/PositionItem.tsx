import {
  CompositeOption,
  OptionSide,
  OptionType,
  ParsedOptionWithPosition,
  RawOption,
} from "../../types/options";
import { timestampToReadableDate } from "../../utils/utils";
import { Button, TableCell, TableRow } from "@mui/material";
import { debug } from "../../utils/debugger";
import { tradeClose } from "../../calls/tradeClose";
import { useAccount } from "@starknet-react/core";
import { AccountInterface } from "starknet";

type Props = {
  option: CompositeOption;
};

const handleTradeClose = async (
  account: AccountInterface | undefined,
  raw: RawOption,
  amount: string
) => {
  if (!account || !raw || !amount) {
    debug("Could not trade close", { account, raw, amount });
    return;
  }
  const res = await tradeClose(account, raw, amount);
  debug("Trade close", res);
};

export const PositionItem = ({ option }: Props) => {
  const { account } = useAccount();
  const {
    strikePrice,
    optionSide,
    optionType,
    maturity,
    positionSize,
    positionValue,
  } = option.parsed as ParsedOptionWithPosition;
  const msMaturity = maturity * 1000;

  const date = timestampToReadableDate(msMaturity);
  const typeText = optionType === OptionType.Put ? "Put" : "Call";
  const sideText = optionSide === OptionSide.Long ? "Long" : "Short";
  const currency = optionType === OptionType.Put ? "USD" : "ETH";

  const desc = `${sideText} ${typeText} with strike $${strikePrice}`;

  return (
    <TableRow>
      <TableCell>{desc}</TableCell>
      <TableCell align="right">{date}</TableCell>
      <TableCell align="right">{positionSize.toFixed(4)}</TableCell>
      <TableCell align="right">
        {currency} {positionValue.toFixed(4)}
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          onClick={() =>
            handleTradeClose(account, option.raw, positionValue.toString(10))
          }
        >
          Close
        </Button>
      </TableCell>
    </TableRow>
  );
};
