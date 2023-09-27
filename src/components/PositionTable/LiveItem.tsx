import { OptionWithPosition } from "../../classes/Option";
import { timestampToReadableDate } from "../../utils/utils";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import { openCloseOptionDialog, setCloseOption } from "../../redux/actions";
import { useTxPending } from "../../hooks/useRecentTxs";
import { TransactionAction } from "../../redux/reducers/transactions";
import buttonStyles from "../../style/button.module.css";

type Props = {
  option: OptionWithPosition;
};

export const LiveItem = ({ option }: Props) => {
  const txPending = useTxPending(option.id, TransactionAction.TradeClose);
  const { strike, maturity, size, value } = option;
  const msMaturity = maturity * 1000;

  const date = timestampToReadableDate(msMaturity);

  const desc = `${option.sideAsText} ${option.typeAsText} with strike $${strike}`;
  const sizeTooltipMessage = BigInt(option.sizeHex).toString(10) + " tokens";
  const decimals = 4;
  const timeNow = new Date().getTime();
  const isExpired = msMaturity - timeNow <= 0;

  const handleClick = () => {
    setCloseOption(option);
    openCloseOptionDialog();
  };

  return (
    <TableRow>
      <TableCell>{desc}</TableCell>
      <TableCell>{isExpired ? `Expired on ${date}` : date}</TableCell>
      <TableCell>
        <Tooltip title={sizeTooltipMessage}>
          <span>{size.toFixed(decimals)}</span>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip title={value}>
          <span>
            {option.symbol} {value.toFixed(decimals)}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell align="right">
        <button
          className={buttonStyles.button}
          onClick={handleClick}
          disabled={txPending}
        >
          {txPending ? "Processing..." : "Close"}
        </button>
      </TableCell>
    </TableRow>
  );
};
