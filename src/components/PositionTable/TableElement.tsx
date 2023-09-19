import { isNonEmptyArray } from "../../utils/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { NoContent } from "../TableNoContent";
import { OptionWithPosition } from "../../classes/Option";
import { LoadingAnimation } from "../Loading/Loading";
import styles from "../../style/table.module.css";

type Props = {
  ItemElem: ({ option }: { option: OptionWithPosition }) => JSX.Element;
  titles: string[];
  isFetching: boolean;
  data: OptionWithPosition[];
  desc: string;
};

export const TableElement = ({
  isFetching,
  data,
  titles,
  ItemElem,
  desc,
}: Props) => {
  if (!isNonEmptyArray(data))
    return (
      <NoContent text={`You are currently not holding any ${desc} options`} />
    );

  return (
    <Table aria-label="portfolio table" className={styles.table}>
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
