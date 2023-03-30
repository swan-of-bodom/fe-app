import { ETH_DIGITS } from "../../constants/amm";
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

const SingleItem = ({ data }: SingleItemProps) => {
  const [open, setOpen] = useState(false);
  const { option, timestamp, action, option_tokens_minted } = data;
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
            <TableCell align="left"></TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="left">{size}</TableCell>
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
                    thanks for providing liquidity
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
            <TableCell align="left">Option</TableCell>
            <TableCell align="left">Strike Price</TableCell>
            <TableCell align="left">Size</TableCell>
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
