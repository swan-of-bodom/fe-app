import { AccountInterface } from "starknet";
import { UserBalance } from "./../../types/wallet";
import { getEthInUsd } from "../../calls/currencies";
import { FinancialData } from "../../types/options";
import { getPremia } from "../../calls/getPremia";
import { debug } from "../../utils/debugger";
import { financialDataEth, financialDataUsd } from "../../utils/computations";
import { math64x61toDecimal } from "../../utils/units";
import { getUserBalance } from "../../calls/balanceOf";
import { OptionWithPremia } from "../../classes/Option";

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

  debug("Fetched ETH, premia and user balance", {
    ethInUsd,
    fetchedPremia,
    userBalance,
  });

  if (signal.aborted) {
    return [null, undefined];
  }

  const convertedPremia = math64x61toDecimal(fetchedPremia);

  return [
    option.isCall
      ? financialDataEth(size, convertedPremia, ethInUsd)
      : financialDataUsd(size, convertedPremia, ethInUsd),
    userBalance,
  ];
};
