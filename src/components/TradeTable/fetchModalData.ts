import { getEthInUsd } from "../../calls/currencies";
import {
  CompositeOption,
  ParsedCallOption,
  ParsedPutOption,
  OptionType,
} from "../../types/options";
import { FinancialData } from "./OptionModal";
import { getPremia } from "../../calls/getPremia";
import { debug } from "../../utils/debugger";
import { shortInteger } from "../../utils/computations";

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
  option: CompositeOption,
  signal: AbortSignal
): Promise<FinancialData | null> => {
  let failed = false;

  const [ethInUsd, fetchedPremia] = await Promise.all([
    recentEthInUsd(),
    getPremia(option, size, false),
  ]).catch(() => {
    failed = true;
    return [];
  });

  if (signal.aborted || failed) {
    return null;
  }

  debug("Fetched premia:", fetchedPremia);
  const { optionType } = option.parsed;

  const res: FinancialData = {
    premiaUsd: 0,
    premiaEth: 0,
    basePremiaUsd: 0,
    basePremiaEth: 0,
    ethInUsd,
  };

  if (optionType === OptionType.Call) {
    // premia is in Wei
    const { premiaWei } = option.parsed as ParsedCallOption;
    if (!premiaWei) {
      throw Error(
        "Parsed Call Option did not contain premiaWei " +
          JSON.stringify(option.parsed)
      );
    }
    const premiaEth = shortInteger(premiaWei, 18);
    const premiaUsd = premiaEth * ethInUsd;
    res.premiaEth = fetchedPremia;
    res.premiaUsd = fetchedPremia * ethInUsd;
    res.basePremiaEth = premiaEth;
    res.basePremiaUsd = premiaUsd;
  }

  if (optionType === OptionType.Put) {
    // premia is in Usd
    const { premiaUsd } = option.parsed as ParsedPutOption;

    if (!premiaUsd) {
      throw Error(
        "Parsed Put Option did not contain premiaWei " +
          JSON.stringify(option.parsed)
      );
    }
    const numPremiaUsd = shortInteger(premiaUsd, 6);
    const premiaEth = numPremiaUsd / ethInUsd;
    res.premiaUsd = fetchedPremia;
    res.premiaEth = fetchedPremia / ethInUsd;
    res.basePremiaEth = premiaEth;
    res.basePremiaUsd = numPremiaUsd;
  }

  return res;
};
