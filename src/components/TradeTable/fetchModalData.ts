import { getEthInUsd } from "../../calls/currencies";
import { OptionWithPremia } from "../../types/options";
import { FinancialData } from "./OptionModal";
import { getPremia } from "../../calls/getPremia";
import { debug } from "../../utils/debugger";
import { isCall } from "../../utils/utils";
import { financialDataEth, financialDataUsd } from "../../utils/computations";

const ethData = {
  ethInUsd: 0,
  lastFetched: 0,
};

const validEthTime = 30 * 1000; // 30s

const recentEthInUsd = async () => {
  const timeNow = new Date().getTime();
  if (timeNow < ethData.lastFetched + validEthTime) {
    return ethData.ethInUsd;
  }
  const ethNow = await getEthInUsd();
  const timeAfterFetch = new Date().getTime();
  ethData.ethInUsd = ethNow;
  ethData.lastFetched = timeAfterFetch;
  return ethNow;
};

export const fetchModalData = async (
  size: number,
  option: OptionWithPremia,
  signal: AbortSignal
): Promise<FinancialData> => {
  const [ethInUsd, fetchedPremia] = await Promise.all([
    recentEthInUsd(),
    getPremia(option, size, false),
  ]).catch((e: Error) => {
    debug("Failed fetching ETH or premia", e.message);
    throw Error("Failed fetching");
  });

  if (signal.aborted) {
    return null;
  }

  const { optionType, premiaDecimal } = option.parsed;

  return isCall(optionType)
    ? financialDataEth(premiaDecimal, fetchedPremia, ethInUsd)
    : financialDataUsd(premiaDecimal, fetchedPremia, ethInUsd);
};
