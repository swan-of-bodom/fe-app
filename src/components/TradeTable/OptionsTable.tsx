import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { CompositeOption } from "../../types/options";
import { OptionModal } from "./OptionModal";
import OptionsTableItem from "./OptionTableItem";
import { useState } from "react";

type Props = {
  options: CompositeOption[];
};

const OptionsTable = ({ options }: Props) => {
  const [modalOption, setModalOption] = useState<CompositeOption>(options[0]);
  const [open, setOpen] = useState<boolean>(false);

  const handleOptionClick = (o: CompositeOption) => {
    setModalOption(o);
    setOpen(true);
  };

  return (
    <>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Strike Price</TableCell>
            <TableCell>Maturity</TableCell>
            <TableCell>Premia</TableCell>
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
              <OptionsTableItem
                option={o}
                handleClick={() => handleOptionClick(o)}
                key={i}
              />
            ))}
        </TableBody>
      </Table>
      <OptionModal open={open} setOpen={setOpen} option={modalOption} />
    </>
  );
};

export default OptionsTable;
