import { OptionWithPremia } from "../../classes/Option";
import { timestampToReadableDate } from "../../utils/utils";
import { TableCell, TableRow, useTheme } from "@mui/material";

type OptionPreviewProps = {
  option: OptionWithPremia;
  handleClick: () => void;
};

const OptionTableItem = ({ option, handleClick }: OptionPreviewProps) => {
  const theme = useTheme();

  const greyGrade = 800;

  const style = {
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.grey[greyGrade],
    },
  };
  const { strike, maturity, type } = option;
  const msMaturity = maturity * 1000;

  const date = timestampToReadableDate(msMaturity);

  const displayPremia = option.premia.toFixed(4);

  return (
    <TableRow sx={style} onClick={handleClick}>
      <TableCell sx={{ borderBottom: "1px solid white" }}>${strike}</TableCell>
      <TableCell sx={{ borderBottom: "1px solid white" }}>{date}</TableCell>
      <TableCell sx={{ borderBottom: "1px solid white" }}>
        {option.symbol} {displayPremia}
      </TableCell>
      <TableCell sx={{ textAlign: "center", borderBottom: "1px solid white" }}>
        <span style={{ color: "#00FF38", fontSize: "20px" }}>+</span>
      </TableCell>
    </TableRow>
  );
};

export default OptionTableItem;
