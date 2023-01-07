import { CompositeOption, ParsedOptionWithPosition } from "../../types/options";
import { isCall, isLong, timestampToReadableDate } from "../../utils/utils";
import { Button, TableCell, TableRow, Tooltip } from "@mui/material";
import { debug } from "../../utils/debugger";
import { useAccount } from "@starknet-react/core";
import { tradeSettle } from "../../calls/tradeSettle";
import { invalidatePositions } from "../../queries/client";
import { afterTransaction } from "../../utils/blockchain";
import { useState } from "react";

type Props = {
  option: CompositeOption;
};

export const InMoneyItem = ({ option }: Props) => {
  const { account } = useAccount();
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSettle = () => {
    if (!account || !option?.raw?.position_size) {
      debug("Could not trade close", { account, raw: option?.raw });
      return;
    }
    setProcessing(true);

    tradeSettle(account, option)
      .then((res) => {
        if (res?.transaction_hash) {
          afterTransaction(res.transaction_hash, () => {
            invalidatePositions();
            setProcessing(false);
          });
        }
      })
      .catch(() => {
        setProcessing(false);
      });
  };

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
  const [typeText, currency] = isCall(optionType)
    ? ["Call", "ETH"]
    : ["Put", "USD"];
  const sideText = isLong(optionSide) ? "Long" : "Short";

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
          disabled={processing}
          variant="contained"
          onClick={handleSettle}
        >
          {processing ? "Processing..." : "Settle"}
        </Button>
      </TableCell>
    </TableRow>
  );
};
