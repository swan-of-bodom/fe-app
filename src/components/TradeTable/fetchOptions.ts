import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { debug } from "../../utils/debugger";
import { parseBatchOfOptions } from "../../utils/parseOption";
import { isNonEmptyArray } from "../../utils/utils";
import { getMainContract } from "../../utils/blockchain";
import { CompositeOption } from "../../types/options";

export const fetchOptions = async (): Promise<CompositeOption[]> => {
  const { LPTOKEN_CONTRACT_ADDRESS, LPTOKEN_CONTRACT_ADDRESS_PUT } =
    getTokenAddresses();

  const contract = getMainContract();

  const callOptionsPromise = contract[
    AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA
  ](LPTOKEN_CONTRACT_ADDRESS);

  const putOptionsPromise = contract[
    AMM_METHODS.GET_ALL_NON_EXPIRED_OPTIONS_WITH_PREMIA
  ](LPTOKEN_CONTRACT_ADDRESS_PUT);

  const call = await callOptionsPromise.catch((e: Error) => {
    debug("Fetching CALL options failed");
    debug("error", e.message);
    return null;
  });

  const put = await putOptionsPromise.catch((e: Error) => {
    debug("Fetching PUT options failed");
    debug("error", e.message);
    return null;
  });

  if (call === null && put === null) {
    throw Error("Failed to fetch options");
  }

  const options = [];

  if (isNonEmptyArray(call) && isNonEmptyArray(call[0])) {
    options.push(...call[0]);
  }

  if (isNonEmptyArray(put) && isNonEmptyArray(put[0])) {
    options.push(...put[0]);
  }

  if (!isNonEmptyArray(options)) {
    return [];
  }

  const compositeOptions = parseBatchOfOptions(options);
  debug("Parsed fetched options", compositeOptions);
  return compositeOptions;
};
