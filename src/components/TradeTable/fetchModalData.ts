import BN from "bn.js";
import { getEthInUsd } from "../../calls/currencies";
import { ETH_BASE_VALUE, USD_BASE_VALUE } from "../../constants/amm";
import {
  CompositeOption,
  ParsedCallOption,
  ParsedPutOption,
  OptionType,
} from "../../types/options";
import { FinancialData } from "./OptionModal";

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
  setLoading: (b: boolean) => void,
  setData: (v: FinancialData) => void
) => {
  setLoading(true);

  const ethInUsd = await recentEthInUsd();
  const { optionType } = option.parsed;
  const precission = 10000;

  const res: FinancialData = {
    premiaUsd: 0,
    premiaEth: 0,
    basePremiaUsd: 0,
    basePremiaEth: 0,
    ethInUsd,
  };

  // TODO: get premia relative to size from AMM endpoint

  if (optionType === OptionType.Call) {
    // premia is in Wei
    const { premiaWei } = option.parsed as ParsedCallOption;
    if (!premiaWei) {
      throw Error(
        "Parsed Call Option did not contain premiaWei " +
          JSON.stringify(option.parsed)
      );
    }
    const premiaEth =
      new BN(premiaWei).mul(new BN(precission)).div(ETH_BASE_VALUE).toNumber() /
      precission;
    const premiaUsd = premiaEth * ethInUsd;
    res.premiaEth = premiaEth * size;
    res.premiaUsd = premiaUsd * size;
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
    const numPremiaUsd =
      new BN(premiaUsd).mul(new BN(precission)).div(USD_BASE_VALUE).toNumber() /
      precission;
    const premiaEth = numPremiaUsd * ethInUsd;
    res.premiaEth = premiaEth * size;
    res.premiaUsd = numPremiaUsd * size;
    res.basePremiaEth = premiaEth;
    res.basePremiaUsd = numPremiaUsd;
  }

  setData(res);
  setLoading(false);
};
