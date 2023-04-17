import {
  Grid,
  Typography,
  Box,
  Skeleton,
  TextField,
  Button,
  debounce,
} from "@mui/material";
import { LoadingAnimation } from "../loading";
import BN from "bn.js";
import { useState, useCallback, useEffect } from "react";
import { approveAndTradeOpen } from "../../calls/tradeOpen";
import { ETH_DIGITS, USD_DIGITS } from "../../constants/amm";
import { FinancialData } from "../../types/options";
import { getPremiaWithSlippage, longInteger } from "../../utils/computations";
import { debug, LogTypes } from "../../utils/debugger";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { timestampToReadableDate, isCall, isLong } from "../../utils/utils";
import { ProfitGraph } from "../CryptoGraph/ProfitGraph";
import { getProfitGraphData } from "../CryptoGraph/profitGraphData";
import { fetchModalData } from "./fetchModalData";
import { ProfitTable, ProfitTableSkeleton } from "./ProfitTable";
import { useAccount } from "../../hooks/useAccount";
import { showToast } from "../../redux/actions";
import { ToastType } from "../../redux/reducers/ui";
import { UserBalance } from "../../types/wallet";
import { OptionWithPremia } from "../../classes/Option";

type TemplateProps = {
  title: string;
  inputText: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  Graph: () => JSX.Element;
  ProfitTable: () => JSX.Element;
  BuyButton: () => JSX.Element;
};

export const TradeCardTemplate = ({
  title,
  inputText,
  handleChange,
  Graph,
  ProfitTable,
  BuyButton,
}: TemplateProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography sx={{ textAlign: "center" }} variant="h6">
          {title}
        </Typography>
      </Grid>

      <Grid item md={7} xs={12}>
        <Graph />
      </Grid>
      <Grid item md={5} xs={12}>
        <Box
          sx={{
            width: "100%",
            aspectRatio: "5/3",
            position: "relative",
          }}
        >
          <ProfitTable />
        </Box>
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
            id="option-size-input"
            label="Option size"
            type="text"
            size="small"
            autoFocus
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
        <BuyButton />
      </Grid>
    </Grid>
  );
};

type TradeState = {
  failed: boolean;
  processing: boolean;
};

type TradeCardProps = {
  option: OptionWithPremia;
};

export const TradeCard = ({ option }: TradeCardProps) => {
  const account = useAccount();
  const [amount, setAmount] = useState<number>(1);
  const [inputText, setInputText] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<FinancialData | null>(null);
  const [balance, setBalance] = useState<UserBalance | undefined>(undefined);
  const [tradeState, updateTradeState] = useState<TradeState>({
    failed: false,
    processing: false,
  });

  const handleChange = handleNumericChangeFactory(setInputText, setAmount);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callWithDelay = useCallback(
    debounce((size: number, controller: AbortController) => {
      fetchModalData(size, option, account, controller.signal)
        .then((v) => {
          if (v && v[0]) {
            setData(v[0]);
            setBalance(v[1]);
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
  const side = isLong(optionSide) ? "Long" : "Short";
  const type = isCall(optionType) ? "Call" : "Put";
  const msMaturity = maturity * 1000;
  const date = timestampToReadableDate(msMaturity);
  const title = `${side} ${type} with strike price $${strikePrice} expiring on ${date}`;

  if (loading || !data) {
    const graph = () => <LoadingAnimation />;
    const profitTable = () => <ProfitTableSkeleton />;
    const buyButton = () => (
      <Skeleton>
        <Button variant="contained">Buy for ETH 0.00001</Button>
      </Skeleton>
    );

    return (
      <TradeCardTemplate
        title={title}
        inputText={inputText}
        handleChange={handleChange}
        Graph={graph}
        ProfitTable={profitTable}
        BuyButton={buyButton}
      />
    );
  }

  const [digits, premia] = isCall(optionType)
    ? [ETH_DIGITS, data.premiaEth]
    : [USD_DIGITS, data.premiaUsd];
  const currentPremia: BN = longInteger(premia, digits);

  const displayPremia = isCall(optionType)
    ? `ETH ${data.premiaEth.toFixed(5)}`
    : `$${data.premiaUsd.toFixed(5)}`;

  const graphData = getProfitGraphData(
    optionType,
    optionSide,
    parseFloat(strikePrice),
    data.premiaUsd,
    amount
  );

  const handleBuy = async () => {
    if (!account) {
      debug(LogTypes.WARN, "No account", account);
      return;
    }

    if (!balance) {
      debug(LogTypes.WARN, "No user balance");
      return;
    }

    if (!amount) {
      showToast("Cannot trade size 0", ToastType.Warn);
      return;
    }

    const premiaWithSlippage = getPremiaWithSlippage(
      currentPremia,
      option.parsed.optionSide,
      false
    );

    updateTradeState({ failed: false, processing: true });

    approveAndTradeOpen(
      account,
      option,
      amount,
      premiaWithSlippage,
      balance,
      updateTradeState
    ).catch(() => updateTradeState({ failed: true, processing: false }));
  };

  const buttonText = () =>
    (isLong(optionSide) ? "Buy" : "Sell") + " for " + displayPremia;

  const BuyButton = () => (
    <Button
      variant="contained"
      disabled={tradeState.processing || !account || loading}
      color={tradeState.failed ? "error" : "primary"}
      onClick={handleBuy}
    >
      {tradeState.processing ? "Processing..." : buttonText()}
    </Button>
  );

  return (
    <TradeCardTemplate
      title={title}
      inputText={inputText}
      handleChange={handleChange}
      Graph={() => ProfitGraph({ data: graphData })}
      ProfitTable={() =>
        ProfitTable({
          premia: data.premiaUsd,
          basePremia: data.basePremiaUsd,
          option,
        })
      }
      BuyButton={BuyButton}
    />
  );
};
