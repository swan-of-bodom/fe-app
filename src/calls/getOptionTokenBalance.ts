import { Abi, Contract } from "starknet";
import { BigNumberish } from "starknet/utils/number";
import LpAbi from "../abi/lptoken_abi.json";
import {
  FetchState,
  setBalanceFetchState,
  setOptions,
} from "../redux/reducers/optionsList";
import { store } from "../redux/store";
import { HighLow, RawOption } from "../types/options";
import { debug, LogTypes } from "../utils/debugger";
import { bnToInt, parseRawOption } from "../utils/parseOption";
import { isNonEmptyArray } from "../utils/utils";

export const getOptionTokenBalance = async (
  tokenAddress: string,
  address: string
): Promise<HighLow> => {
  const contract = new Contract(LpAbi as Abi, tokenAddress);
  const res: BigNumberish = await contract.balanceOf(address);

  if (!isNonEmptyArray(res)) {
    return { low: 0, high: 0 };
  }

  const { low, high }: { low: BigNumberish; high: BigNumberish } = res[0];

  const [lowInt, highInt] = [bnToInt(low), bnToInt(high)];

  debug(`Balance of ${tokenAddress.slice(-5)} is`, {
    low: lowInt,
    high: highInt,
  });

  return { low: lowInt, high: highInt };
};

const getTokenAddress = (raw: RawOption): string | null =>
  parseRawOption(raw)?.tokenAddress || null;

export const updateListBalance = async (address: string) => {
  const list = store.getState().rawOptionsList;

  if (!isNonEmptyArray(list)) {
    return;
  }

  store.dispatch(setBalanceFetchState(FetchState.Fetching));
  const updatePromises = list.map(
    async (raw: RawOption): Promise<RawOption> => {
      const t = getTokenAddress(raw);
      if (!t) {
        return raw;
      }
      const res = await getOptionTokenBalance(t, address);
      return { ...raw, high_low: res };
    }
  );

  const updated = await Promise.all(updatePromises).catch((e) => {
    debug(LogTypes.ERROR, "Get option token balance failed", e);
    store.dispatch(setBalanceFetchState(FetchState.Failed));
  });

  store.dispatch(setOptions(updated));
  store.dispatch(setBalanceFetchState(FetchState.Done));
};
