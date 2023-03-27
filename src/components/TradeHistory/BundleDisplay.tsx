import { ETH_DIGITS } from "../../constants/amm";
import { ITradeHistoryBundle, ITradeData } from "../../types/history";
import { shortInteger } from "../../utils/computations";
import { hexToBN, timestampToRichDate } from "../../utils/utils";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useState, SyntheticEvent } from "react";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

type PropsBundle = {
  bundles: ITradeHistoryBundle[];
};

const actionToVerb = (action: string): string => {
  switch (action) {
    case "TradeOpen":
      return "bought";

    case "TradeClose":
      return "sold";

    default:
      return "settled";
  }
};

const getTransactionDescription = (history: ITradeData) => {
  const { action, timestamp, option_tokens_minted } = history;
  const size = shortInteger(
    hexToBN(option_tokens_minted).toString(10),
    ETH_DIGITS
  );
  const date = timestampToRichDate(timestamp * 1000);
  return `On ${date} you ${actionToVerb(action)} size ${size}`;
};

type SingleBundleProps = {
  expanded: string | false;
  handleChange: (
    s: string
  ) => (event: SyntheticEvent, newExpanded: boolean) => void;
  bundle: ITradeHistoryBundle;
};

const SingleBundle = ({
  expanded,
  handleChange,
  bundle,
}: SingleBundleProps) => {
  const { option, history } = bundle;
  return (
    <Accordion
      expanded={expanded === option.id}
      onChange={handleChange(option.id)}
    >
      <AccordionSummary>
        <Typography>
          {option.display + (option.isExpired ? " - Expired" : "")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {history.map((v, i) => (
          <Typography key={i}>{getTransactionDescription(v)}</Typography>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export const BundlesDisplay = ({ bundles }: PropsBundle) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <>
      {bundles.map((bundle, i) => (
        <SingleBundle
          expanded={expanded}
          handleChange={handleChange}
          bundle={bundle}
          key={i}
        />
      ))}
    </>
  );
};
