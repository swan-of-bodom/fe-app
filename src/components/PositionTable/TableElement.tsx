import { isNonEmptyArray } from "../../utils/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { NoContent } from "../TableNoContent";
import { CompositeOption } from "../../types/options";
import { LoadingAnimation } from "../loading";

type Props = {
  ItemElem: ({ option }: { option: CompositeOption }) => JSX.Element;
  titles: string[];
  isFetching: boolean;
  data: CompositeOption[];
};

export const TableElement = ({ isFetching, data, titles, ItemElem }: Props) => {
  if (!isNonEmptyArray(data))
    return (
      <NoContent text="It seems you are not currently holding any positions." />
    );

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          {titles.map((t, i) => (
            <TableCell key={i}>{t}</TableCell>
          ))}
          <TableCell align="right">
            {isFetching && <LoadingAnimation size={30} />}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((o, i: number) => (
          <ItemElem option={o} key={i} />
        ))}
      </TableBody>
    </Table>
  );
};
