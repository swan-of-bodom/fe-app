import { Table, TableBody, TableRow, TableCell, Skeleton } from "@mui/material";
import { OptionSide, OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import { isCall } from "../../utils/utils";

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
  strikePrice: number;
  basePremia: number;
  premia: number;
  side: OptionSide;
  type: OptionType;
};

export const ProfitTable = ({
  strikePrice,
  basePremia,
  premia,
  side,
  type,
}: ProfitTableProps) => {
  const long = side === OptionSide.Long;
  const limited = "$" + premia.toFixed(2);
  const unlimited = "Unlimited";
  const breakEven =
    "$" +
    (isCall(type)
      ? strikePrice + basePremia
      : strikePrice - basePremia
    ).toFixed(2);
  debug({ strikePrice, basePremia, breakEven });
  return (
    <ProfitTableTemplate
      limited={limited}
      unlimited={unlimited}
      breakEven={breakEven}
      isLong={long}
    />
  );
};
