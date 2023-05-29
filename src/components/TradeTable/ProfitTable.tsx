import { Table, TableBody, TableRow, TableCell, Skeleton } from "@mui/material";
import { OptionWithPremia } from "../../classes/Option";
import { debug } from "../../utils/debugger";

type ProfitTableTemplateProps = {
  limited: string;
  unlimited: string;
  breakEven: string;
  isLong: boolean;
};

const ProfitTableTemplate = ({
  limited,
  unlimited,
  breakEven,
  isLong,
}: ProfitTableTemplateProps) => (
  <Table>
    <TableBody>
      <TableRow>
        <TableCell>Maximum profit</TableCell>
        <TableCell>{isLong ? unlimited : limited}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Maximum loss</TableCell>
        <TableCell>{!isLong ? unlimited : limited}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Break even</TableCell>
        <TableCell>{breakEven}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const ProfitTableSkeleton = () => (
  <Skeleton>
    <ProfitTableTemplate
      limited="unlimited"
      unlimited="unlimited"
      breakEven="$1000"
      isLong={true}
    />
  </Skeleton>
);

type ProfitTableProps = {
  option: OptionWithPremia;
  basePremia: number;
  premia: number;
};

export const ProfitTable = ({
  option,
  basePremia,
  premia,
}: ProfitTableProps) => {
  const numStrikePrice = option.parsed.strikePrice;
  const limited = "$" + premia.toFixed(2);
  const unlimited = "Unlimited";
  const breakEven =
    "$" +
    (option.isCall
      ? numStrikePrice + basePremia
      : numStrikePrice - basePremia
    ).toFixed(2);
  debug({ numStrikePrice, strk: option.parsed.strikePrice, breakEven });

  return (
    <ProfitTableTemplate
      limited={limited}
      unlimited={unlimited}
      breakEven={breakEven}
      isLong={option.isLong}
    />
  );
};
