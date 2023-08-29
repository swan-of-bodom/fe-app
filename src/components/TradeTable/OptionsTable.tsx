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
      <Table
        aria-label="simple table"
        sx={{ border: "1px solid white", marginTop: "10px" }}
      >
        <TableHead>
          <TableRow sx={{ border: "1px solid white " }}>
            <TableCell sx={{ borderBottom: "1px solid white" }}>
              Strike Price
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid white" }}>
              Maturity
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid white" }}>
              Premia
            </TableCell>
            <TableCell
              sx={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid white",
              }}
            >
              <SlippageButton />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {options
            .sort((a, b) => b.parsed.strikePrice - a.parsed.strikePrice)
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
