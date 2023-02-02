import {
  Box,
  Button,
  ButtonGroup,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { useCloseOption } from "../../hooks/useCloseOption";
import { usePremiaQuery } from "../../hooks/usePremiaQuery";
import { debug } from "../../utils/debugger";
import { CustomDialogTitle } from "../MultiDialog/MultiDialog";
import {
  OptionSide,
  OptionType,
  OptionWithPosition,
} from "../../types/options";
import { handleNumericChangeFactory } from "../../utils/inputHandling";
import { useDebounce } from "../../hooks/useDebounce";
import { math64x61toDecimal, math64x61ToInt } from "../../utils/units";
import BN from "bn.js";
import { digitsByType, isCall, isLong } from "../../utils/utils";
import { getPremiaWithSlippage, shortInteger } from "../../utils/computations";
import { tradeClose } from "../../calls/tradeClose";
import { invalidatePositions } from "../../queries/client";
import { afterTransaction } from "../../utils/blockchain";
import { useAccount } from "../../hooks/useAccount";
import { store } from "../../redux/store";
import { useEth } from "../../hooks/useCurrency";

const premiaToDisplayValue = (
  premia: number,
  ethInUsd: number,
  max: number,
  side: OptionSide,
  type: OptionType
) => {
  switch (type + side) {
    case OptionType.Call + OptionSide.Long:
      return `$${(premia * ethInUsd).toFixed(2)}`;
    case OptionType.Put + OptionSide.Long:
      return `$${premia.toFixed(2)}`;
    case OptionType.Call + OptionSide.Short:
      return `$${((max - premia) * ethInUsd).toFixed(2)}`;
    case OptionType.Put + OptionSide.Short:
      return `$${(max * ethInUsd - premia).toFixed(2)}`;
    default:
      // unreachable
      throw Error(`Invalid type or side ${type}, ${side}`);
  }
};

type Props = {
  option: OptionWithPosition;
};

type TemplateProps = {
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleClick: (n: number) => void;
  inputText: string;
  max: number;
  children: ReactNode;
};

const Template = ({
  handleChange,
  handleClick,
  inputText,
  max,
  children,
}: TemplateProps) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          id="close-position-input"
          label="Amount"
          type="numeric"
          size="small"
          value={inputText}
          autoFocus
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            inputMode: "decimal",
          }}
          sx={{ m: 2 }}
          onChange={handleChange}
        />
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button onClick={() => handleClick(max)}>Max</Button>
        </ButtonGroup>
      </Box>
      {children}
    </>
  );
};

const WithOption = ({ option }: Props) => {
  const account = useAccount();
  const ethInUsd = useEth();
  const {
    positionSize: max,
    optionSide: side,
    optionType: type,
  } = option.parsed;
  const [size, setSize] = useState<number>(max);
  const [inputText, setInputText] = useState<string>(String(max));
  const debouncedSize = useDebounce<number>(size);

  const { status, data, error, isFetching } = usePremiaQuery(
    option,
    size,
    true
  );

  const cb = (n: number) => (n > max ? max : n);
  const handleChange = handleNumericChangeFactory(setInputText, setSize, cb);
  const handleClick = (n: number) => {
    setSize(n);
    setInputText(String(n));
  };

  const close = (premia: BN) => {
    if (!account || !size) {
      debug("Could not trade close", {
        account,
        raw: option?.raw,
        size,
      });
      return;
    }

    tradeClose(account, option, premia, size).then((res) => {
      if (res?.transaction_hash) {
        afterTransaction(res.transaction_hash, () => {
          invalidatePositions();
        });
      }
    });
  };

  debug("usePremiaQuery", { status, data, error, isFetching });

  if (debouncedSize === 0) {
    // loading...
    return (
      <Template
        handleChange={handleChange}
        handleClick={handleClick}
        inputText={inputText}
        max={max}
      >
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Box
            sx={{
              my: 3,
            }}
          >
            <Box>
              <Typography>Cannot close size 0</Typography>
            </Box>
          </Box>
          <Button variant="contained" disabled>
            Close selected
          </Button>
        </Box>
      </Template>
    );
  }

  if (isFetching || !ethInUsd) {
    // loading...
    return (
      <Template
        handleChange={handleChange}
        handleClick={handleClick}
        inputText={inputText}
        max={max}
      >
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" height="50px" />
      </Template>
    );
  }

  if (typeof data === "undefined") {
    // no data
    return (
      <Template
        handleChange={handleChange}
        handleClick={handleClick}
        inputText={inputText}
        max={max}
      >
        <div>Did not receive any data</div>
      </Template>
    );
  }

  const digits = digitsByType(option.parsed.optionType);
  const premia = math64x61toDecimal(data);
  const premiaWithSlippage = shortInteger(
    getPremiaWithSlippage(
      new BN(math64x61ToInt(data, digits)),
      isLong(side) ? OptionSide.Short : OptionSide.Long
    ).toString(10),
    digits
  );
  const slippage = store.getState().settings.slippage;

  const displayPremia = premiaToDisplayValue(premia, ethInUsd, max, side, type);
  const displayPremiaWithSlippage = premiaToDisplayValue(
    premiaWithSlippage,
    ethInUsd,
    max,
    side,
    type
  );

  return (
    <Template
      handleChange={handleChange}
      handleClick={handleClick}
      inputText={inputText}
      max={max}
    >
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <Box
          sx={{
            my: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexFlow: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>Total Received</Typography>
            <Typography>{displayPremia}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexFlow: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>Slippage {slippage}% limit</Typography>
            <Typography>{displayPremiaWithSlippage}</Typography>
          </Box>
        </Box>
        <Button variant="contained" onClick={() => close(new BN(data))}>
          Close selected
        </Button>
      </Box>
    </Template>
  );
};

export const ClosePosition = () => {
  const option = useCloseOption();

  if (!option) {
    return (
      <>
        <CustomDialogTitle title="Close Position" />
        Something went wrong
      </>
    );
  }

  const type = isCall(option.parsed.optionType) ? "Call" : "Put";
  const title = `$${option.parsed.strikePrice} ${type}`;

  return (
    <>
      <CustomDialogTitle title={title} />
      <WithOption option={option} />
    </>
  );
};
