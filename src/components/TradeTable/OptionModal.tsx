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
  useTheme,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import BN from "bn.js";
import { useCallback, useEffect, useState } from "react";
import { approveAndTradeOpen } from "../../calls/tradeOpen";
import { OptionSide, OptionType, OptionWithPremia } from "../../types/options";
import { debug, LogTypes } from "../../utils/debugger";
import {
  debounce,
  isCall,
  isDarkTheme,
  timestampToReadableDate,
} from "../../utils/utils";
import { ProfitGraph } from "../CryptoGraph/ProfitGraph";
import { getProfitGraphData } from "../CryptoGraph/profitGraphData";
import { fetchModalData } from "./fetchModalData";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { longInteger } from "../../utils/computations";
import { ETH_DIGITS, USD_DIGITS } from "../../constants/amm";

type ModalProps = {
  open: boolean;
  setOpen: (b: boolean) => void;
  option: OptionWithPremia;
};

type OptionBoxProps = {
  option: OptionWithPremia;
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
  debug({ strikePrice, basePremia, breakEven });
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

const OptionBox = ({ option }: OptionBoxProps) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState<number>(1);
  const [inputText, setInputText] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<FinancialData>(null);
  const [tradeState, updateTradeState] = useState<TradeState>({
    failed: false,
    processing: false,
  });

  const handleChange = handleNumericChangeFactory(setInputText, setAmount);

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

  const { strikePrice, maturity, optionType, optionSide } = option.parsed;
  const side = optionSide === OptionSide.Long ? "Long" : "Short";
  const type = optionType === OptionType.Call ? "Call" : "Put";
  const msMaturity = maturity * 1000;
  const date = timestampToReadableDate(msMaturity);

  const digits = isCall(optionType) ? ETH_DIGITS : USD_DIGITS;
  const premia = isCall(optionType) ? data?.premiaEth : data?.premiaUsd;
  const currentPremia: BN = premia ? longInteger(premia, digits) : new BN(0);

  const displayPremia = isCall(optionType)
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

  const handleBuy = async () => {
    if (!account || !amount) {
      debug(LogTypes.WARN, "Missing some of the inputs:", { account, amount });
      return;
    }
    updateTradeState({ failed: false, processing: true });

    const cb = () => updateTradeState({ failed: false, processing: false });

    approveAndTradeOpen(
      account,
      option,
      amount,
      option.parsed.optionType,
      option.parsed.optionSide,
      currentPremia,
      cb
    ).catch(() => updateTradeState({ failed: true, processing: false }));
  };

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
            label="Option size"
            type="text"
            size="small"
            value={inputText}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              inputMode: "decimal",
            }}
            onChange={handleChange}
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
            onClick={handleBuy}
          >
            {tradeState.processing ? "Processing..." : buttonText()}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export const OptionModal = ({ open, setOpen, option }: ModalProps) => {
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: 2,
    minWidth: "min(500px, 95vw)",
    background: isDarkTheme(theme) ? "black" : "white",
    border: `solid 1px ${theme.palette.primary.main}`,
  };

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
