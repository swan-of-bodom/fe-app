import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import BN from "bn.js";
import { useEffect, useState } from "react";
import { AccountInterface } from "starknet";
import { approveAndTradeOpen } from "../../calls/tradeOpen";
import { Float } from "../../types/base";
import {
  CompositeOption,
  OptionSide,
  OptionType,
  ParsedCallOption,
  ParsedPutOption,
} from "../../types/options";
import { debug, LogTypes } from "../../utils/debugger";
import { timestampToReadableDate } from "../../utils/utils";
import { ProfitGraph } from "../CryptoGraph/ProfitGraph";
import { getProfitGraphData } from "../CryptoGraph/profitGraphData";
import { fetchModalData } from "./fetchModalData";

type ModalProps = {
  open: boolean;
  setOpen: (b: boolean) => void;
  option: CompositeOption;
};

type OptionBoxProps = {
  option: CompositeOption;
};

type TradeState = {
  failed: boolean;
  processing: boolean;
};

export type FinancialData = {
  premiaUsd: number;
  premiaEth: number;
  basePremiaUsd: number;
  basePremiaEth: number;
  ethInUsd: number;
} | null;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  margin: 2,
  padding: 2,
};

const handleBuy = async (
  account: AccountInterface | undefined,
  amount: Float,
  option: CompositeOption,
  premia: BN,
  updateTradeState: (v: TradeState) => void
) => {
  if (!account || !amount) {
    debug(LogTypes.WARN, "Missing some of the inputs:", { account, amount });
    return;
  }
  updateTradeState({ failed: false, processing: true });

  const res = await approveAndTradeOpen(
    account,
    option,
    amount,
    option.parsed.optionType,
    option.parsed.optionSide,
    premia
  );

  updateTradeState(
    res
      ? { failed: false, processing: false }
      : { failed: true, processing: false }
  );
};

const OptionBox = ({ option }: OptionBoxProps) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<FinancialData>(null);

  useEffect(() => {
    fetchModalData(amount, option, setLoading, setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const [tradeState, updateTradeState] = useState<TradeState>({
    failed: false,
    processing: false,
  });

  const { strikePrice, maturity, optionType, optionSide } = option.parsed;
  const side = optionSide === OptionSide.Long ? "Long" : "Short";
  const type = optionType === OptionType.Call ? "Call" : "Put";
  const msMaturity = maturity * 1000;
  const date = timestampToReadableDate(msMaturity);

  const currentPremia: BN =
    optionType === OptionType.Call
      ? new BN((option.parsed as ParsedCallOption).premiaWei)
      : new BN((option.parsed as ParsedPutOption).premiaUsd);

  const displayPremia =
    optionType === OptionType.Call
      ? `ETH ${data?.premiaEth && data?.premiaEth.toFixed(5)}`
      : `$${data?.premiaUsd && data?.premiaUsd.toFixed(5)}`;

  debug("Graph data: ", [optionType, optionSide]);
  const graphData =
    loading || !data
      ? { plot: [{ usd: 0, market: 0 }], domain: [0, 0] }
      : getProfitGraphData(
          optionType,
          optionSide,
          parseFloat(strikePrice),
          data.premiaUsd,
          amount
        );

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography sx={{ textAlign: "center" }} variant="h6">
          {side} {type} with strike price ${strikePrice} expiring on {date}
        </Typography>
      </Grid>

      <Grid item md={7} xs={12}>
        <Box
          sx={{
            width: "100%",
            aspectRatio: "5/3",
            position: "relative",
          }}
        >
          <ProfitGraph data={graphData} loading={loading} />
        </Box>
      </Grid>
      <Grid item md={5} xs={12}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Maximum profit</TableCell>
              <TableCell>
                {optionSide === OptionSide.Long
                  ? "infinity"
                  : loading || !data
                  ? " --"
                  : "$" + data.premiaUsd.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maximum loss</TableCell>
              <TableCell>
                {optionSide === OptionSide.Short
                  ? "infinity"
                  : loading || !data
                  ? " --"
                  : "$" + data.premiaUsd.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Break even</TableCell>
              <TableCell>
                {loading || !data
                  ? " --"
                  : "$" +
                    (parseFloat(strikePrice) + data.basePremiaUsd).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
      <Grid item md={7}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Typography sx={{ display: "block" }}>Option size</Typography>
          <TextField
            id="outlined-number"
            label="Option size"
            type="number"
            size="small"
            value={amount}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              maxLength: 13,
              step: "0.01",
              min: 0,
              max: 50,
            }}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </Box>
      </Grid>
      <Grid item md={5}>
        <Button
          variant="contained"
          disabled={tradeState.processing || !account || loading}
          color={tradeState.failed ? "error" : "primary"}
          onClick={() =>
            handleBuy(account, amount, option, currentPremia, updateTradeState)
          }
        >
          {optionSide === OptionSide.Long ? "Buy" : "Sell"} for {displayPremia}
        </Button>
      </Grid>
    </Grid>
  );
};

export const OptionModal = ({ open, setOpen, option }: ModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="buy option modal"
      aria-describedby="set amount and buy"
    >
      <Paper sx={style} elevation={2}>
        <OptionBox option={option} />
      </Paper>
    </Modal>
  );
};
