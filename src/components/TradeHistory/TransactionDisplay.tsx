import { ETH_DIGITS, USDC_DIGITS } from "../../constants/amm";
import { ITradeHistory } from "../../types/history";
import { shortInteger } from "../../utils/computations";
import {
  timestampToDateAndTime,
  timestampToInsuranceDate,
} from "../../utils/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import tableStyles from "../../style/table.module.css";
import { borderValue } from "../../style/sx";

type TransactionTableProps = {
  transactions: ITradeHistory[];
};

type SingleItemProps = {
  data: ITradeHistory;
};

const actionPrefix = "carmine_protocol::amm_core::amm::AMM::";

const capitalToReadable = (type: string, capital: string) => {
  const n = BigInt(capital);
  if (type === "Call") {
    return "ETH " + shortInteger(n, ETH_DIGITS);
  }
  return "$" + shortInteger(n, USDC_DIGITS);
};

const SingleItem = ({ data }: SingleItemProps) => {
  const {
    option,
    liquidity_pool,
    timestamp,
    action,
    tokens_minted,
    capital_transfered,
  } = data;

  const size = shortInteger(BigInt(tokens_minted).toString(10), ETH_DIGITS);

  const [date, time] = timestampToDateAndTime(timestamp * 1000);

  return (
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell sx={{ borderRight: borderValue }}>{time}</TableCell>
      <TableCell>
        {option && timestampToInsuranceDate(option.maturity * 1000)}
      </TableCell>
      <TableCell align="left">{action.replace(actionPrefix, "")}</TableCell>
      {option ? (
        <>
          <TableCell align="left">{`${option.sideAsText} ${option.typeAsText} ${option.pairId}`}</TableCell>
          <TableCell align="left">{`$${option.strike}`}</TableCell>
          <TableCell align="left">{size.toFixed(4)}</TableCell>
        </>
      ) : (
        <>
          <TableCell align="left">{liquidity_pool}</TableCell>
          <TableCell align="left"></TableCell>
          <Tooltip
            title={capitalToReadable(
              liquidity_pool as string,
              capital_transfered
            )}
          >
            <TableCell align="left">{size.toFixed(4)}</TableCell>
          </Tooltip>
        </>
      )}
    </TableRow>
  );
};

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [expanded, setExpanded] = useState(false);

  const COLLAPSED_LENGTH = 5;

  const size = expanded ? transactions.length : COLLAPSED_LENGTH;

  return (
    <TableContainer>
      <Table className={tableStyles.table} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell sx={{ borderRight: borderValue }}>Time</TableCell>
            <TableCell align="left">Option Expiry</TableCell>
            <TableCell align="left">Action</TableCell>
            <TableCell align="left">Option / Pool</TableCell>
            <TableCell align="left">Strike Price</TableCell>
            <Tooltip
              placement="top"
              title="Amount of tokens transfered divided by 10^18"
            >
              <TableCell align="left">Size</TableCell>
            </Tooltip>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.slice(0, size).map((transaction, i) => (
            <SingleItem data={transaction} key={i} />
          ))}
          {transactions.length > COLLAPSED_LENGTH && (
            <TableRow>
              <td
                onClick={() => setExpanded(!expanded)}
                colSpan={7}
                style={{ textAlign: "center", cursor: "pointer" }}
              >
                {expanded ? "Show less" : "Show more"}
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
