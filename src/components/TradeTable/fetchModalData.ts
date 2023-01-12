import { getEthInUsd } from "../../calls/currencies";
import { OptionType, OptionWithPremia } from "../../types/options";
import { FinancialData } from "./OptionModal";
import { getPremia } from "../../calls/getPremia";
import { debug } from "../../utils/debugger";

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
): Promise<FinancialData | null> => {
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

  const { optionType } = option.parsed;

  if (optionType === OptionType.Call) {
    const basePremiaEth = option.parsed.premiaDecimal;
    const basePremiaUsd = basePremiaEth * ethInUsd;

    const res: FinancialData = {
      premiaEth: fetchedPremia,
      premiaUsd: fetchedPremia * ethInUsd,
      basePremiaEth,
      basePremiaUsd,
      ethInUsd,
    };

    debug("Calculated financial data for Call", res);

    return res;
  }

  if (optionType === OptionType.Put) {
    const basePremiaUsd = option.parsed.premiaDecimal;
    const basePremiaEth = basePremiaUsd / ethInUsd;

    const res: FinancialData = {
      premiaEth: fetchedPremia,
      premiaUsd: fetchedPremia / ethInUsd,
      basePremiaEth,
      basePremiaUsd,
      ethInUsd,
    };

    debug("Calculated financial data for Put", res);

    return res;
  }

  // Unreachable
  return null;
};
