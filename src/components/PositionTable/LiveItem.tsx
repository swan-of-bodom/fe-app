import { OptionWithPosition } from "../../types/options";
import { isCall, isLong, timestampToReadableDate } from "../../utils/utils";
import { Button, TableCell, TableRow, Tooltip } from "@mui/material";
import { openCloseOptionDialog, setCloseOption } from "../../redux/actions";

type Props = {
  option: OptionWithPosition;
};

export const LiveItem = ({ option }: Props) => {
  const {
    strikePrice,
    optionSide,
    optionType,
    maturity,
    positionSize,
    positionValue,
  } = option.parsed;
  const msMaturity = maturity * 1000;

  const date = timestampToReadableDate(msMaturity);
  const [typeText, currency] = isCall(optionType)
    ? ["Call", "ETH"]
    : ["Put", "USD"];
  const sideText = isLong(optionSide) ? "Long" : "Short";

  const desc = `${sideText} ${typeText} with strike $${strikePrice}`;
  const decimals = 4;
  const timeNow = new Date().getTime();
  const isExpired = msMaturity - timeNow <= 0;

  const handleClick = () => {
    setCloseOption(option);
    openCloseOptionDialog();
  };

  return (
    <TableRow
      sx={{
        cursor: "pointer",
      }}
    >
      <TableCell>{desc}</TableCell>
      <TableCell>{isExpired ? `Expired on ${date}` : date}</TableCell>
      <TableCell>{positionSize.toFixed(decimals)}</TableCell>
      <TableCell>
        <Tooltip title={positionValue}>
          <span>
            {currency} {positionValue.toFixed(decimals)}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell align="right">
        <Button variant="contained" onClick={handleClick}>
          Close
        </Button>
      </TableCell>
    </TableRow>
  );
};
