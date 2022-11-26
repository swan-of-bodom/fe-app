import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { debug } from "../../utils/debugger";
import { parseBatchOfOptions } from "../../utils/parseOption";
import { isNonEmptyArray } from "../../utils/utils";
import { getMainContract } from "../../utils/blockchain";
import { CompositeOption } from "../../types/options";

export enum ActionList {
  Error = "ERROR",
  Loading = "LOADING",
  Done = "DONE",
}

export type Action = {
  type: ActionList;
  payload?: any;
};

export type State = {
  loading: boolean;
  error: string;
  data: CompositeOption[];
};

export const initialState = {
  loading: false,
  error: "",
  data: [],
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionList.Loading:
      return { ...state, error: "", loading: true };
    case ActionList.Error:
      return { ...state, error: action.payload, loading: false };
    case ActionList.Done:
      return { ...state, error: "", loading: false, data: action.payload };
    default:
      return state;
  }
};

export const fetchOptions = async (dispatch: (action: Action) => void) => {
  dispatch({ type: ActionList.Loading });

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
    dispatch({ type: ActionList.Error, payload: "Failed to fetch options" });
    return;
  }

  const options = [];

  if (isNonEmptyArray(call) && isNonEmptyArray(call[0])) {
    options.push(...call[0]);
  }

  if (isNonEmptyArray(put) && isNonEmptyArray(put[0])) {
    options.push(...put[0]);
  }

  if (!isNonEmptyArray(options)) {
    dispatch({ type: ActionList.Done, payload: [] });
    return;
  }

  const compositeOptions = parseBatchOfOptions(options);
  debug("Parsed fetched options", compositeOptions);
  dispatch({ type: ActionList.Done, payload: compositeOptions });
};
