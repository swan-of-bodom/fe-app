import {
  CompositeOption,
  OptionSide,
  OptionType,
  ParsedOptionWithPosition,
  RawOption,
} from "../../types/options";
import { timestampToReadableDate } from "../../utils/utils";
import { Button, TableCell, TableRow, TextField, Tooltip } from "@mui/material";
import { debug } from "../../utils/debugger";
import { tradeClose } from "../../calls/tradeClose";
import { useAccount } from "@starknet-react/core";
import { AccountInterface } from "starknet";
import BN from "bn.js";
import { useState } from "react";
import { BASE_MATH_64_61 } from "../../constants/amm";

type Props = {
  option: CompositeOption;
};

const handleTradeClose = async (
  account: AccountInterface | undefined,
  amount: number,
  raw: RawOption
) => {
  if (!account || !raw || !raw.position_size || !amount) {
    debug("Could not trade close", { account, raw, amount });
    return;
  }
  const precission = 10000;
  const size64x61 = new BN(amount * precission)
    .mul(BASE_MATH_64_61)
    .div(new BN(precission))
    .toString(10);
  const res = await tradeClose(account, raw, size64x61);
  debug("Trade close", res);
};

export const PositionItem = ({ option }: Props) => {
  const [amount, setAmount] = useState<number>(0.0);
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
  const min = 0.01;

  return (
    <TableRow>
      <TableCell>{desc}</TableCell>
      <TableCell align="right">{date}</TableCell>
      <TableCell align="right">{positionSize.toFixed(decimals)}</TableCell>
      <TableCell align="right">
        <Tooltip title={positionValue}>
          <span>
            {currency} {positionValue.toFixed(decimals)}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell align="right">
        {" "}
        <TextField
          id="outlined-number"
          label="Amount"
          type="number"
          size="small"
          value={amount}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            maxLength: 13,
            step: "0.01",
            min,
          }}
          onChange={(e) => {
            const valueIn = parseFloat(e.target.value);
            debug(positionSize, valueIn);
            if (isNaN(valueIn)) {
              setAmount(0);
              return;
            }
            debug(valueIn);
            if (valueIn > positionSize) {
              setAmount(positionSize);
              return;
            }
            if (valueIn < min) {
              setAmount(min);
              return;
            }
            setAmount(valueIn);
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          onClick={() => handleTradeClose(account, amount, option.raw)}
        >
          Close
        </Button>
      </TableCell>
    </TableRow>
  );
};
