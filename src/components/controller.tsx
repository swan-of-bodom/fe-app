import { useEffect, useState } from "react";
import { Contract } from "starknet";
import { AMM_METHODS, LPTOKEN_CONTRACT_ADDRESS } from "../constants/amm";
import { useAmmContract } from "../hooks/amm";
import { OptionsListFetchState, setFetchState, setOptions } from "../redux/reducers/optionsList";
import { store } from "../redux/store";
import { RawOption } from "../types/options";
import { debug, LogTypes } from "../utils/debugger";
import { isNonEmptyArray } from "../utils/utils";

const updateOptionsList = async (contract: Contract) => {
  const promises = [];
  const n = 8;
  store.dispatch(setFetchState(OptionsListFetchState.Fetching));

  for (let i = 0; i < n; i++) {
    promises.push(
      contract[AMM_METHODS.GET_AVAILABLE_OPTIONS](LPTOKEN_CONTRACT_ADDRESS, i)
    );
  }

  Promise.all(promises)
    .then((v) => {
      if (isNonEmptyArray(v)) {
        // Currently only returns one option
        const options: RawOption[] = v.map((o) => o[0]);
        debug("Promises resolved:", options);

        store.dispatch(setOptions(options));
        store.dispatch(setFetchState(OptionsListFetchState.Done));
      }
    })
    .catch((e) => {
      debug(LogTypes.ERROR, "Failed to get Options list", e);
      store.dispatch(setFetchState(OptionsListFetchState.Failed));
    });
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
