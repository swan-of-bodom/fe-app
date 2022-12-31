import {
  CompositeOption,
  OptionSide,
  OptionType,
  ParsedOptionWithPosition,
  RawOption,
} from "../../types/options";
import { timestampToReadableDate } from "../../utils/utils";
import { Button, TableCell, TableRow, Tooltip } from "@mui/material";
import { debug } from "../../utils/debugger";
import { useAccount } from "@starknet-react/core";
import { AccountInterface } from "starknet";
import BN from "bn.js";
import { tradeSettle } from "../../calls/tradeSettle";

type Props = {
  option: CompositeOption;
};

const handleSettle = async (
  account: AccountInterface | undefined,
  raw: RawOption
) => {
  if (!account || !raw || !raw.position_size) {
    debug("Could not trade close", { account, raw });
    return;
  }

  const size64x61 = new BN(raw.position_size).toString(10);

  const res = await tradeSettle(account, raw, size64x61);
  debug("Trade settle", res);
};

export const InMoneyItem = ({ option }: Props) => {
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
  const decimals = 4;

  return (
    <TableRow>
      <TableCell>{desc}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{positionSize.toFixed(decimals)}</TableCell>
      <TableCell>
        <Tooltip title={positionValue}>
          <span>
            {currency} {positionValue.toFixed(decimals)}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          onClick={() => handleSettle(account, option.raw)}
        >
          {"Settle"}
        </Button>
      </TableCell>
    </TableRow>
  );
};
