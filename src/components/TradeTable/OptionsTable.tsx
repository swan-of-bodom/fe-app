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

const OptionsTable = ({ options }: Props) => {
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Strike Price</TableCell>
          <TableCell align="right">Maturity</TableCell>
          <TableCell align="right">Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {options.map((o, i: number) => (
          <OptionsTableItem option={o} key={i} />
        ))}
      </TableBody>
    </Table>
  );
};

export default OptionsTable;
