import BN from "bn.js";
import { assert } from "../utils";
import { Option } from "../../classes/Option";

export const parseOption = (arr: BN[]): Option => {
  const expectedLength = 6;

  assert(arr.length === expectedLength, "option with position length");

  const raw = {
    option_side: arr[0],
    maturity: arr[1],
    strike_price: arr[2],
    quote_token_address: arr[3],
    base_token_address: arr[4],
    option_type: arr[5],
  };

  return new Option({ raw });
};
