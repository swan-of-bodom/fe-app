import { AccountInterface } from "starknet";
import { UserBalance } from "./../../types/wallet";
import { getEthInUsd } from "../../calls/currencies";
import { FinancialData, OptionWithPremia } from "../../types/options";
import { getPremia } from "../../calls/getPremia";
import { debug } from "../../utils/debugger";
import { isCall } from "../../utils/utils";
import { financialDataEth, financialDataUsd } from "../../utils/computations";
import { math64x61toDecimal } from "../../utils/units";
import { getWallet } from "../../network/account";
import { getUserBalance } from "../../calls/balanceOf";

const ethData = {
  ethInUsd: 0,
  lastFetched: 0,
};

const validDuration = 30 * 1000; // 30s

const recentEthInUsd = async () => {
  const timeNow = new Date().getTime();
  if (timeNow < ethData.lastFetched + validDuration) {
    return ethData.ethInUsd;
  }
  const ethNow = await getEthInUsd();
  const timeAfterFetch = new Date().getTime();
  ethData.ethInUsd = ethNow;
  ethData.lastFetched = timeAfterFetch;
  return ethNow;
};

const balanceData: { balance: UserBalance | undefined; lastFetched: number } = {
  balance: undefined,
  lastFetched: 0,
};

const recentUserBalance = async (account: AccountInterface | undefined) => {
  const timeNow = new Date().getTime();
  if (timeNow < balanceData.lastFetched + validDuration) {
    return balanceData.balance;
  }
  if (!account) {
    return;
  }
  const balanceNow = await getUserBalance(account);
  const timeAfterFetch = new Date().getTime();
  balanceData.balance = balanceNow;
  balanceData.lastFetched = timeAfterFetch;
  return balanceData.balance;
};

export const fetchModalData = async (
  size: number,
  option: OptionWithPremia,
  account: AccountInterface | undefined,
  signal: AbortSignal
): Promise<[FinancialData | null, UserBalance | undefined]> => {
  const [ethInUsd, fetchedPremia, userBalance] = await Promise.all([
    recentEthInUsd(),
    getPremia(option, size, false),
    recentUserBalance(account),
  ]).catch((e: Error) => {
    debug("Failed fetching ETH or premia", e.message);
    throw Error("Failed fetching");
  });

  debug("Fetched ETH and premia", { ethInUsd, fetchedPremia });

  if (signal.aborted) {
    return [null, undefined];
  }

  const { optionType, premiaDecimal } = option.parsed;

  const convertedPremia = math64x61toDecimal(fetchedPremia);

  return [
    isCall(optionType)
      ? financialDataEth(premiaDecimal, convertedPremia, ethInUsd)
      : financialDataUsd(premiaDecimal, convertedPremia, ethInUsd),
    userBalance,
  ];
};
