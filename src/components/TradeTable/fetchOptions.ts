import { Contract } from "starknet";
import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { CompositeOption } from "../../types/options";
import { debug } from "../../utils/debugger";
import { parseBatchOfOptions } from "../../utils/parseOption";
import { isNonEmptyArray } from "../../utils/utils";

export const fetchOptions = async (
  contract: Contract,
  setLoading: (v: boolean) => void,
  setError: (v: string) => void,
  setData: (d: CompositeOption[]) => void
) => {
  setLoading(true);
  setError("");

  const callOptionsPromise = contract[
    AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA
  ](getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS);

  const putOptionsPromise = contract[
    AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA
  ](getTokenAddresses().LPTOKEN_CONTRACT_ADDRESS_PUT);

  const call = await callOptionsPromise.catch((e: string) => {
    debug("Fetching CALL options failed");
    debug("error", e);
    return null;
  });

  const put = await putOptionsPromise.catch((e: string) => {
    debug("Fetching PUT options failed");
    debug("error", e);
    return null;
  });

  if (call === null && put === null) {
    setError("Failed to fetch options");
    setLoading(false);
    return;
  }

  const options = [];

  if (isNonEmptyArray(call) && isNonEmptyArray(call[0])) {
    options.push(...call[0]);
  }

  if (isNonEmptyArray(put) && isNonEmptyArray(put[0])) {
    options.push(...put[0]);
  }

  if (isNonEmptyArray(options)) {
    const compositeOptions = parseBatchOfOptions(options);
    debug("Parsed fetched options", compositeOptions);
    setData(compositeOptions);
  }

  setLoading(false);
};
