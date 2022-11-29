import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { CompositeOption } from "../../types/options";
import OptionsTableItem from "./OptionTableItem";

type Props = {
  options: CompositeOption[];
};

const OptionsTable = ({ options }: Props) => (
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>Strike Price</TableCell>
        <TableCell align="center">Maturity</TableCell>
        <TableCell align="center">Amount</TableCell>
        <TableCell align="center"></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {options
        .sort(
          (a, b) =>
            parseInt(b.parsed.strikePrice, 10) -
            parseInt(a.parsed.strikePrice, 10)
        )
        .map((o, i: number) => (
          <OptionsTableItem option={o} key={i} />
        ))}
    </TableBody>
  </Table>
);

export default OptionsTable;
