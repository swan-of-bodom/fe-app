import { OptionWithPosition } from "../../classes/Option";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import { openCloseOptionDialog, setCloseOption } from "../../redux/actions";
import { useTxPending } from "../../hooks/useRecentTxs";
import { TransactionAction } from "../../redux/reducers/transactions";

type Props = {
  option: OptionWithPosition;
};

export const LiveItem = ({ option }: Props) => {
  const txPending = useTxPending(option.optionId, TransactionAction.TradeClose);

  const sizeTooltipMessage = BigInt(option.sizeHex).toString(10) + " tokens";
  const decimals = 4;

  const handleClick = () => {
    setCloseOption(option);
    openCloseOptionDialog();
  };

  return (
    <TableRow>
      <TableCell>{option.name}</TableCell>
      <TableCell>{option.sideAsText}</TableCell>
      <TableCell>{`$${option.strike}`}</TableCell>
      <TableCell>{option.dateShort}</TableCell>
      <TableCell>
        <Tooltip title={sizeTooltipMessage}>
          <span>{option.size.toFixed(decimals)}</span>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip title={option.value}>
          <span>
            {option.symbol} {option.value.toFixed(decimals)}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell align="right">
        <button onClick={handleClick} disabled={txPending}>
          {txPending ? "Processing..." : "Close"}
        </button>
      </TableCell>
    </TableRow>
  );
};
