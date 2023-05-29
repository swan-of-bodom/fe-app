import { AccountInterface } from "starknet";
import { UserBalance } from "./../../types/wallet";
import { FinancialData } from "../../types/options";
import { getPremia } from "../../calls/getPremia";
import { debug } from "../../utils/debugger";
import { math64x61toDecimal } from "../../utils/units";
import { getUserBalance } from "../../calls/balanceOf";
import { OptionWithPremia } from "../../classes/Option";

const validDuration = 30 * 1000; // 30s

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
  const [{ base, quote }, fetchedPremia, userBalance] = await Promise.all([
    option.tokenPricesInUsd(),
    getPremia(option, size, false),
    recentUserBalance(account),
  ]).catch((e: Error) => {
    debug("Failed fetching ETH or premia", e.message);
    throw Error("Failed fetching");
  });

  debug("Fetched ETH, premia and user balance", {
    base,
    quote,
    fetchedPremia,
    userBalance,
  });

  if (signal.aborted) {
    return [null, undefined];
  }

  const convertedPremia = math64x61toDecimal(fetchedPremia);

  return [
    option.financialData(size, convertedPremia, base, quote),
    userBalance,
  ];
};
