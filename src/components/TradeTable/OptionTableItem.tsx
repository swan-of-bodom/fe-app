import { OptionWithPremia } from "../../classes/Option";
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

  return (
    <TableRow sx={style} onClick={handleClick}>
      <TableCell sx={{ borderBottom: "1px solid white" }}>
        {option.strikeCurrency} {option.strike}
      </TableCell>
      <TableCell sx={{ borderBottom: "1px solid white" }}>
        {option.dateRich}
      </TableCell>
      <TableCell sx={{ borderBottom: "1px solid white" }}>
        {option.symbol} {option.displayPremia}
      </TableCell>
      <TableCell sx={{ textAlign: "center", borderBottom: "1px solid white" }}>
        <span style={{ color: "#00FF38", fontSize: "20px" }}>+</span>
      </TableCell>
    </TableRow>
  );
};

export default OptionTableItem;
