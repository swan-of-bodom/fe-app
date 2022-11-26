import BN from "bn.js";
import { AMM_METHODS } from "../../constants/amm";
import {
  CompositeOption,
  OptionSide,
  OptionType,
  ParsedOptionWithPosition,
} from "../../types/options";
import { getMainContract } from "../../utils/blockchain";
import { debug } from "../../utils/debugger";
import { isNonEmptyArray } from "../../utils/utils";

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

const parsePosition = (arr: BN[]): CompositeOption => {
  const raw = {
    option_side: arr[0],
    maturity: arr[1],
    strike_price: arr[2],
    quote_token_address: arr[3],
    base_token_address: arr[4],
    option_type: arr[5],
    position_size: arr[6],
    value_of_position: arr[7],
  };

  const precision = 1000000;

  const type =
    new BN(raw.option_type).toString(10) === OptionType.Call
      ? OptionType.Call
      : OptionType.Put;
  const parsed = {
    optionSide:
      new BN(raw.option_side).toString(10) === OptionSide.Long
        ? OptionSide.Long
        : OptionSide.Short,
    maturity: new BN(raw.maturity).toNumber(),
    strikePrice: new BN(raw.strike_price)
      .div(new BN(2).pow(new BN(61)))
      .toString(10),
    quoteToken: "0x" + new BN(raw.quote_token_address).toString(16),
    baseToken: "0x" + new BN(raw.base_token_address).toString(16),
    optionType: type,
    positionSize:
      new BN(raw.position_size)
        .mul(new BN(precision))
        .div(new BN(2).pow(new BN(61)))
        .toNumber() / precision,
    positionValue:
      new BN(raw.value_of_position)
        .mul(new BN(precision))
        .div(new BN(2).pow(new BN(61)))
        .toNumber() / precision,
  };
  return { raw, parsed };
};

export const parseBatchOfOptions = (arr: BN[]): CompositeOption[] => {
  const a = 8;
  const l = arr.length;
  const options = [];

  for (let i = 0; i < l / a; i++) {
    const cur = arr.slice(i * a, (i + 1) * a);
    options.push(parsePosition(cur));
  }

  return options;
};

export const fetchPositions = async (
  address: string,
  dispatch: (action: Action) => void
) => {
  dispatch({ type: ActionList.Loading });

  const contract = getMainContract();

  const res = await contract[AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER](
    address
  ).catch((e: string) => {
    debug("Failed while calling", AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER);
    debug("error", e);
    return;
  });

  if (isNonEmptyArray(res)) {
    dispatch({ type: ActionList.Done, payload: [] });
  }

  try {
    const composite = parseBatchOfOptions(res[0]);

    if (!isNonEmptyArray(composite)) {
      dispatch({ type: ActionList.Done, payload: [] });
      return;
    }

    // remove position with size 0 (BE rounding error)
    const filtered = composite.filter(
      ({ parsed }) => !!(parsed as ParsedOptionWithPosition).positionSize
    );

    debug("Fetched options with position", filtered);
    dispatch({ type: ActionList.Done, payload: filtered });
  } catch (e: unknown) {
    debug("Failed to parse positions", res);
    debug((e as Error)?.message);
  }
};
