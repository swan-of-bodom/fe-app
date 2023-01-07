import BN from "bn.js";
import {
  AMM_METHODS,
  ETH_BASE_VALUE,
  USD_BASE_VALUE,
} from "../../constants/amm";
import { CompositeOption, ParsedOptionWithPosition } from "../../types/options";
import { getMainContract } from "../../utils/blockchain";
import { debug } from "../../utils/debugger";
import { isCall, isNonEmptyArray, toHex } from "../../utils/utils";
import { QueryFunctionContext } from "react-query";
import { bnToOptionSide, bnToOptionType } from "../../utils/conversions";

const parsePosition = (arr: BN[]): CompositeOption => {
  const raw = {
    option_side: arr[0],
    maturity: arr[1],
    strike_price: arr[2],
    quote_token_address: arr[3],
    base_token_address: arr[4],
    option_type: arr[5],
    position_size: arr[6],
    value_of_position: arr[8],
  };

  const precision = 1000000;

  const optionType = bnToOptionType(raw.option_type);
  const optionSide = bnToOptionSide(raw.option_side);
  const maturity = new BN(raw.maturity).toNumber();
  const strikePrice = new BN(raw.strike_price)
    .div(new BN(2).pow(new BN(61)))
    .toString(10);
  const quoteToken = toHex(raw.quote_token_address);
  const baseToken = toHex(raw.base_token_address);
  // int
  const positionSize =
    new BN(raw.position_size)
      .mul(new BN(precision))
      .div(isCall(optionType) ? ETH_BASE_VALUE : USD_BASE_VALUE)
      .toNumber() / precision;
  // math64_61
  const positionValue =
    new BN(raw.value_of_position)
      .mul(new BN(precision))
      .div(new BN(2).pow(new BN(61)))
      .toNumber() / precision;

  const parsed = {
    optionSide,
    optionType,
    maturity,
    strikePrice,
    positionSize,
    positionValue,
    quoteToken,
    baseToken,
  };

  debug({ raw, parsed });

  return { raw, parsed };
};

export const parseBatchOfOptions = (arr: BN[]): CompositeOption[] => {
  debug("Parsing positions", arr);
  const a = 9;
  const l = arr.length;
  const options = [];

  for (let i = 0; i < l / a; i++) {
    const cur = arr.slice(i * a, (i + 1) * a);
    options.push(parsePosition(cur));
  }

  return options;
};

export const fetchPositions = async ({
  queryKey,
}: QueryFunctionContext<[string, string | undefined]>): Promise<
  CompositeOption[]
> => {
  const address = queryKey[1];
  if (!address) {
    throw Error("No address");
  }
  const contract = getMainContract();

  const res = await contract[AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER](
    address
  ).catch((e: Error) => {
    debug("Failed while calling", AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER);
    throw Error(e.message);
  });

  if (!isNonEmptyArray(res)) {
    debug("Empty positions response", res);
    return [];
  }

  try {
    const composite = parseBatchOfOptions(res[0]);

    if (!isNonEmptyArray(composite)) {
      return [];
    }

    // remove position with size 0 (BE rounding error)
    const filtered = composite
      .filter(
        ({ parsed }) => !!(parsed as ParsedOptionWithPosition).positionSize
      )
      .sort((a, b) => a.parsed.maturity - b.parsed.maturity);

    debug("Fetched options with position", filtered);
    return filtered;
  } catch (e: unknown) {
    debug("Failed to parse positions", res);
    throw Error("Failed to parse positions");
  }
};
