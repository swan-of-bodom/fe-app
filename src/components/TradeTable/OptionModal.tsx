import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import BN from "bn.js";
import { useCallback, useEffect, useState } from "react";
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
import { debounce, timestampToReadableDate } from "../../utils/utils";
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
  padding: 2,
  minWidth: "min(500px, 95vw)",
  background: "black",
};

type ProfitTableProps = {
  loading: boolean;
  strikePrice: number;
  basePremia: number;
  premia: number;
  side: OptionSide;
  type: OptionType;
};

const ProfitTable = ({
  strikePrice,
  basePremia,
  premia,
  side,
  type,
}: ProfitTableProps) => {
  const isLong = side === OptionSide.Long;
  const limited = "$" + premia.toFixed(2);
  const unlimited = "Unlimited";
  const breakEven =
    "$" +
    (type === OptionType.Call
      ? strikePrice + basePremia
      : strikePrice - basePremia
    ).toFixed(2);
  return (
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callWithDelay = useCallback(
    debounce((size: number, controller: AbortController) => {
      fetchModalData(size, option, controller.signal)
        .then((v) => {
          if (v) {
            setData(v);
            setLoading(false);
          }
        })
        .catch((e) => {
          debug("Failed fetching modal data");
          debug("warn", e.message);
        });
    }),
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    callWithDelay(amount, controller);
    return () => {
      controller.abort();
    };
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

  const buttonText = () =>
    (optionSide === OptionSide.Long ? "Buy" : "Sell") + " for " + displayPremia;
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
        {loading || !data ? (
          <Skeleton>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Maximum profit</TableCell>
                  <TableCell>unlimited</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maximum loss</TableCell>
                  <TableCell>unlimited</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Break even</TableCell>
                  <TableCell>$1000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Skeleton>
        ) : (
          <ProfitTable
            loading={loading}
            premia={data!.premiaUsd}
            basePremia={data!.basePremiaUsd}
            strikePrice={parseFloat(strikePrice)}
            side={optionSide}
            type={optionType}
          />
        )}
      </Grid>
      <Grid item md={7} xs={12}>
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
      <Grid
        item
        sx={{ justifyContent: "center", display: "flex" }}
        md={5}
        xs={12}
      >
        {loading ? (
          <Skeleton>
            <Button variant="contained">Buy for ETH 0.00001</Button>
          </Skeleton>
        ) : (
          <Button
            variant="contained"
            disabled={tradeState.processing || !account || loading}
            color={tradeState.failed ? "error" : "primary"}
            onClick={() =>
              handleBuy(
                account,
                amount,
                option,
                currentPremia,
                updateTradeState
              )
            }
          >
            {buttonText()}
          </Button>
        )}
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
