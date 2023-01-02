import {
  CompositeOption,
  OptionType,
  ParsedCallOption,
  ParsedPutOption,
} from "../../types/options";
import { timestampToReadableDate, weiToEth } from "../../utils/utils";
import { Box, TableCell, TableRow, useTheme } from "@mui/material";
import BN from "bn.js";
import { USD_BASE_VALUE } from "../../constants/amm";
import { ThemeVariants } from "../../style/themes";
import TouchAppIcon from "@mui/icons-material/TouchApp";

type OptionPreviewProps = {
  option: CompositeOption;
  handleClick: () => void;
};

const OptionTableItem = ({ option, handleClick }: OptionPreviewProps) => {
  const theme = useTheme();

  const greyGrade = theme.palette.mode === ThemeVariants.dark ? 800 : 300;

  const style = {
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.grey[greyGrade],
    },
  };
  const { strikePrice, maturity, optionType } = option.parsed;
  const msMaturity = maturity * 1000;

  const date = timestampToReadableDate(msMaturity);

  const currentPremia: BN =
    optionType === OptionType.Call
      ? new BN((option.parsed as ParsedCallOption).premiaWei)
      : new BN((option.parsed as ParsedPutOption).premiaUsd);

  const digits = 4;
  const displayPremia =
    optionType === OptionType.Call
      ? weiToEth(currentPremia, digits)
      : (
          currentPremia
            .mul(new BN(10 ** digits))
            .div(USD_BASE_VALUE)
            .toNumber() /
          10 ** digits
        ).toFixed(digits);
  const currency = optionType === OptionType.Call ? "ETH" : "USD";

  return (
    <TableRow sx={style} onClick={handleClick}>
      <TableCell sx={{ width: "calc(100%/3)" }}>${strikePrice}</TableCell>
      <TableCell sx={{ width: "calc(100%/3)" }}>{date}</TableCell>
      <TableCell
        sx={{
          width: "calc(100%/3)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {currency} {displayPremia}
          <TouchAppIcon
            sx={{ ml: "auto", color: theme.palette.primary.main }}
          />
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default OptionTableItem;
