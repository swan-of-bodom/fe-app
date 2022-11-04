import { useEffect } from "react";
import { Contract } from "starknet";
import { getOptionTokenAddress } from "../calls/getOptionTokenAddress";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
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
  if (store.getState().optionsList.state === FetchState.Fetching) {
    return;
  }

  const promises = [];
  const n = 8;

  store.dispatch(setFetchState(FetchState.Fetching));

  for (let i = 0; i < n; i++) {
    promises.push(
      contract[AMM_METHODS.GET_AVAILABLE_OPTIONS](
        getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS,
        i
      )
    );
  }

  let failed = false;
  const res = await Promise.all(promises).catch((e) => {
    debug(LogTypes.ERROR, "Failed to get Options list", e);
    store.dispatch(setFetchState(FetchState.Failed));
    failed = true;
  });

  if (failed) {
    return;
  }

  if (!isNonEmptyArray(res)) {
    store.dispatch(setFetchState(FetchState.Done));
    return;
  }

  const options: RawOption[] = res.map((o) => o[0]);

  debug("Fetched initial options", options);

  const p = options
    .map((r) => getOptionTokenAddress(contract, r))
    .filter(Boolean);

  failed = false;
  const rawWithAddress: Array<RawOption | undefined> = await Promise.all(
    p
  ).catch((e) => {
    debug(LogTypes.WARN, "Failed to get addresses for the options", e);
    store.dispatch(setFetchState(FetchState.Failed));
    failed = true;
    return [];
  });

  if (failed) {
    return;
  }

  const final = rawWithAddress.filter(Boolean);
  store.dispatch(setOptions(final));
  store.dispatch(setFetchState(FetchState.Done));
  debug("Addresses resolved", final);
};

export const Controller = () => {
  const { contract } = useAmmContract();

  useEffect(() => {
    if (contract) {
      updateOptionsList(contract);
    }
  }, [contract]);

  return null;
};
