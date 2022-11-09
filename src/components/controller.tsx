import { useEffect } from "react";
import { Contract } from "starknet";
import { AMM_METHODS, getTokenAddresses } from "../constants/amm";
import { useAmmContract } from "../hooks/amm";
import {
  FetchState,
  setCompositeOptions,
  setFetchState,
} from "../redux/reducers/optionsList";
import { store } from "../redux/store";
import { debug } from "../utils/debugger";
import { parseBatchOfOptions } from "../utils/parseOption";
import { isNonEmptyArray } from "../utils/utils";

const updateOptionsList = async (contract: Contract) => {
  if (store.getState().optionsList.state === FetchState.Fetching) {
    return;
  }

  if (isNonEmptyArray(store.getState().optionsList.rawOptionsList)) {
    return;
  }

  store.dispatch(setFetchState(FetchState.Fetching));

  let failed = false;
  const callOptionsPromise = contract[
    AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA
  ](getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS);

  const putOptionsPromise = contract[
    AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA
  ](getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS_PUT);

  const res = await Promise.all([callOptionsPromise, putOptionsPromise]).catch(
    (e) => {
      debug("Fetching options failed");
      debug("error", e);
      store.dispatch(setFetchState(FetchState.Failed));
      failed = true;
    }
  );

  if (failed || !isNonEmptyArray(res)) {
    store.dispatch(setFetchState(FetchState.Failed));
    return;
  }

  const options = res.flat(2);

  debug("Received options", options);

  if (isNonEmptyArray(options)) {
    const compositeOptions = parseBatchOfOptions(options);
    debug("Parsed fetched options", compositeOptions);
    store.dispatch(setCompositeOptions(compositeOptions));
  }

  store.dispatch(setFetchState(FetchState.Done));
};

export const Controller = () => {
  const { contract } = useAmmContract();

  useEffect(() => {
    updateOptionsList(contract!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
