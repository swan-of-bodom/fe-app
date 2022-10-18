import { useState } from "react";
import { Contract } from "starknet";
import { AMM_METHODS, LPTOKEN_CONTRACT_ADDRESS } from "../constants/amm";
import { useAmmContract } from "../hooks/amm";
import { set } from "../redux/reducers/optionsList";
import { store } from "../redux/store";
import { RawOption } from "../types/options";
import { isNonEmptyArray } from "../utils/utils";

const updateOptionsList = async (contract: Contract) => {
  const promises = [];
  const n = 8;

  for (let i = 0; i < n; i++) {
    promises.push(
      contract[AMM_METHODS.GET_AVAILABLE_OPTIONS](LPTOKEN_CONTRACT_ADDRESS, i)
    );
  }

  Promise.all(promises).then((v) => {
    if (isNonEmptyArray(v)) {
      // Currently only returns one option
      const options: RawOption[] = v.map((o) => o[0]);
      console.log("Promises resolved:", options);

      store.dispatch(set(options));
    }
  });
};

export const Controller = () => {
  const { contract } = useAmmContract();
  const [optionsListUpdateCalled, setOptionsListUpdateCalled] =
    useState<boolean>(false);

  if (contract && !optionsListUpdateCalled) {
    setOptionsListUpdateCalled(true);
    updateOptionsList(contract);
  }

  return null;
};
