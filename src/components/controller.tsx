import { useEffect, useState } from "react";
import { Contract } from "starknet";
import { getOptionTokenAddress } from "../calls/getOptionTokenAddress";
import { AMM_METHODS, LPTOKEN_CONTRACT_ADDRESS } from "../constants/amm";
import { useAmmContract } from "../hooks/amm";
import {
  FetchState,
  setFetchState,
  setOptions,
} from "../redux/reducers/optionsList";
import { store } from "../redux/store";
import { RawOption } from "../types/options";
import { debug, LogTypes } from "../utils/debugger";
import { isNonEmptyArray } from "../utils/utils";

const updateOptionsList = async (contract: Contract) => {
  const promises = [];
  const n = 8;
  store.dispatch(setFetchState(FetchState.Fetching));

  for (let i = 0; i < n; i++) {
    promises.push(
      contract[AMM_METHODS.GET_AVAILABLE_OPTIONS](LPTOKEN_CONTRACT_ADDRESS, i)
    );
  }

  const res = await Promise.all(promises).catch((e) => {
    debug(LogTypes.ERROR, "Failed to get Options list", e);
    store.dispatch(setFetchState(FetchState.Failed));
  });

  if (!isNonEmptyArray(res)) {
    store.dispatch(setFetchState(FetchState.Done));
    return;
  }

  const options: RawOption[] = res.map((o) => o[0]);

  debug("Fetched initial options", options);

  const p = options
    .map((r) => getOptionTokenAddress(contract, r))
    .filter(Boolean);

  const rawWithAddress: Array<RawOption | undefined> = await Promise.all(
    p
  ).catch((e) => {
    debug(LogTypes.ERROR, "Failed to get Options list", e);
    store.dispatch(setFetchState(FetchState.Failed));
    return [];
  });

  const final = rawWithAddress.filter(Boolean);
  store.dispatch(setOptions(final));
  store.dispatch(setFetchState(FetchState.Done));
  debug("Addresses resolved", final);
};

export const Controller = () => {
  const { contract } = useAmmContract();
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    if (contract && !fetched) {
      setFetched(true);
      updateOptionsList(contract);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  return null;
};
