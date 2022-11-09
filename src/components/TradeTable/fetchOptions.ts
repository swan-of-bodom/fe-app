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
      setError(e);
      failed = true;
    }
  );

  if (failed || !isNonEmptyArray(res)) {
    setLoading(false);
    return;
  }

  const options = res.flat(2);

  debug("Received options", options);

  if (isNonEmptyArray(options)) {
    const compositeOptions = parseBatchOfOptions(options);
    debug("Parsed fetched options", compositeOptions);
    setData(compositeOptions);
  }

  setLoading(false);
};
