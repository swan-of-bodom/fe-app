import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { OptionWithPremia } from "../../classes/Option";
import { OptionModal } from "./OptionModal";
import OptionsTableItem from "./OptionTableItem";
import { useState } from "react";
import { SlippageButton } from "../Slippage/SlippageButton";
import tableStyles from "../../style/table.module.css";

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
      <Table className={tableStyles.table} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ border: "1px solid white " }}>
            <TableCell>Strike Price</TableCell>
            <TableCell>Maturity</TableCell>
            <TableCell>Premia</TableCell>
            <TableCell className={tableStyles.slippageCell}>
              <SlippageButton />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {options
            .sort((a, b) => b.strike - a.strike)
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
