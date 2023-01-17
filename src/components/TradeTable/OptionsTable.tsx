import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { OptionWithPremia } from "../../types/options";
import { OptionModal } from "./OptionModal";
import OptionsTableItem from "./OptionTableItem";
import { useState } from "react";

type Props = {
  options: OptionWithPremia[];
};

const OptionsTable = ({ options }: Props) => {
  const [modalOption, setModalOption] = useState<OptionWithPremia>(options[0]);
  const [open, setOpen] = useState<boolean>(false);

  const handleOptionClick = (o: OptionWithPremia) => {
    setModalOption(o);
    setOpen(true);
  };

  return (
    <>
      <Table aria-label="simple table">
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
