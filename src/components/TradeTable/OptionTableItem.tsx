import { OptionWithPremia } from "../../types/options";
import { isCall, timestampToReadableDate } from "../../utils/utils";
import { Box, TableCell, TableRow, useTheme } from "@mui/material";
import { ThemeVariants } from "../../style/themes";
import TouchAppIcon from "@mui/icons-material/TouchApp";

type OptionPreviewProps = {
  option: OptionWithPremia;
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

  const displayPremia = option.parsed.premiaDecimal.toFixed(4);
  const currency = isCall(optionType) ? "ETH" : "USD";

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
