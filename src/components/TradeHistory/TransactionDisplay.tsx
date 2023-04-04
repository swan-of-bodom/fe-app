import { ETH_DIGITS, USD_DIGITS } from "../../constants/amm";
import { ITradeHistory } from "../../types/history";
import { shortInteger } from "../../utils/computations";
import { hexToBN, timestampToShortTimeDate } from "../../utils/utils";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { InfoOutlined, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";

type TransactionTableProps = {
  transactions: ITradeHistory[];
};

type SingleItemProps = {
  data: ITradeHistory;
};

const capitalToReadable = (type: string, capital: string) => {
  const n = hexToBN(capital).toString(10);
  if (type === "Call") {
    return "ETH " + shortInteger(n, ETH_DIGITS);
  }
  return "$" + shortInteger(n, USD_DIGITS);
};

const SingleItem = ({ data }: SingleItemProps) => {
  const [open, setOpen] = useState(false);
  const {
    option,
    liquidity_pool,
    timestamp,
    action,
    option_tokens_minted,
    capital_transfered,
  } = data;
  const size = shortInteger(
    hexToBN(option_tokens_minted).toString(10),
    ETH_DIGITS
  );
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <InfoOutlined />}
          </IconButton>
        </TableCell>
        <TableCell>{timestampToShortTimeDate(timestamp * 1000)}</TableCell>
        <TableCell align="left">{action}</TableCell>
        {option ? (
          <>
            <TableCell align="left">{`${option.sideAsText} ${option.typeAsText}`}</TableCell>
            <TableCell align="left">{`$${option.parsed.strikePrice}`}</TableCell>
            <TableCell align="left">{size}</TableCell>
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
              <TableCell align="left">{size}</TableCell>
            </Tooltip>
          </>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {option ? (
                <>
                  {" "}
                  <Typography variant="h5" gutterBottom component="div">
                    Option
                  </Typography>
                  <Typography variant="body1" gutterBottom component="div">
                    {option.display}
                  </Typography>
                </>
              ) : (
                <>
                  {" "}
                  <Typography variant="h5" gutterBottom component="div">
                    Liquidity
                  </Typography>
                  <Typography variant="body1" gutterBottom component="div">
                    {action === "DepositLiquidity"
                      ? "Liquidity has been transfered into the liquidity pool"
                      : "Liquidity has been removed from the liquidity pool and transfered into your wallet"}
                  </Typography>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="left">Action</TableCell>
            <TableCell align="left">Option/Pool</TableCell>
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
          {transactions.map((transaction, i) => (
            <SingleItem data={transaction} key={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
