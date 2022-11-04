import { Abi, Contract } from "starknet";
import { BigNumberish } from "starknet/utils/number";
import { Uint256, uint256ToBN } from "starknet/utils/uint256";
import LpAbi from "../abi/lptoken_abi.json";
import {
  FetchState,
  setBalanceFetchState,
  setOptions,
} from "../redux/reducers/optionsList";
import { store } from "../redux/store";
import { RawOption, RawOptionWithBalance } from "../types/options";
import { debug, LogTypes } from "../utils/debugger";
import { parseRawOption } from "../utils/parseOption";
import { isNonEmptyArray } from "../utils/utils";

export const getOptionTokenBalance = async (
  tokenAddress: string,
  address: string
): Promise<BigNumberish> => {
  const contract = new Contract(LpAbi as Abi, tokenAddress);
  const res: Uint256[] = await contract.balanceOf(address);

  if (!isNonEmptyArray(res)) {
    return 0;
  }

  const balance: BigNumberish = uint256ToBN(res[0]);

  debug(`Balance of ${tokenAddress.slice(-5)} is`, balance);

  return balance;
};

const getTokenAddress = (raw: RawOption): string | null =>
  parseRawOption(raw)?.tokenAddress || null;

export const updateListBalance = async (address: string) => {
  const list = store.getState().optionsList.rawOptionsList;

  if (!isNonEmptyArray(list)) {
    return;
  }

  store.dispatch(setBalanceFetchState(FetchState.Fetching));
  const updatePromises = list.map(
    async (raw: RawOption): Promise<RawOptionWithBalance> => {
      const t = getTokenAddress(raw);
      if (!t) {
        return { ...raw, balance: 0 };
      }
      const res = await getOptionTokenBalance(t, address);
      return { ...raw, balance: res };
    }
  );

  const updated = await Promise.all(updatePromises).catch((e) => {
    debug(LogTypes.ERROR, "Get option token balance failed", e);
    store.dispatch(setBalanceFetchState(FetchState.Failed));
  });

  store.dispatch(setOptions(updated));
  store.dispatch(setBalanceFetchState(FetchState.Done));
};
