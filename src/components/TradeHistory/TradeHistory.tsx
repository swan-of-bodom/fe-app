import { Typography } from "@mui/material";
import { useQuery } from "react-query";
import { useAccount } from "../../hooks/useAccount";
import { QueryKeys } from "../../queries/keys";
import {
  ITradeData,
  ITradeHistory,
  ITradeHistoryBundle,
} from "../../types/history";
import { LoadingAnimation } from "../loading";
import { BundlesDisplay } from "./BundleDisplay";
import { fetchHistoricalData } from "./fetchHistoricalData";

type PropsAddress = {
  address: string;
};

const generateBundles = (history: ITradeHistory[]): ITradeHistoryBundle[] => {
  const bundles = history.reduce((acc, v) => {
    const {
      timestamp,
      action,
      caller,
      capital_transfered,
      option_tokens_minted,
      option,
    } = v;
    const history: ITradeData = {
      timestamp,
      action,
      caller,
      capital_transfered,
      option_tokens_minted,
    };
    if (acc.some((other) => v.option.eq(other.option))) {
      acc.find((other) => v.option.eq(other.option))?.history.push(history);
    } else {
      acc.push({ option, history: [history] });
    }
    return acc;
  }, [] as ITradeHistoryBundle[]);

  return bundles.sort(
    (a, b) => b.option.parsed.maturity - a.option.parsed.maturity
  );
};

const TradeHistoryWithAddress = ({ address }: PropsAddress) => {
  const { isLoading, isError, data } = useQuery(
    [QueryKeys.tradeHistory, address],
    fetchHistoricalData
  );

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <Typography>Something went wrong, please try again later</Typography>
    );
  }

  if (!data?.length) {
    return <Typography>We do not have any data on your past trades</Typography>;
  }

  const bundles = generateBundles(data);

  return <BundlesDisplay bundles={bundles} />;
};

export const TradeHistory = () => {
  const account = useAccount();

  if (!account) {
    return <p>Connect your wallet to see your trade history</p>;
  }

  return <TradeHistoryWithAddress address={account.address} />;
};
