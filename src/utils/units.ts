import BN from "bn.js";
import { Decimal, Int, Math64x61 } from "../types/units";
import { longInteger, shortInteger } from "./computations";
import { BASE_MATH_64_61 } from "../constants/amm";
import { uint256 } from "starknet";

const PRECISSION_DIGITS = 20;
const PRECISSION_BASE_VALUE = new BN(10).pow(new BN(PRECISSION_DIGITS));

export const decimalToInt = (n: Decimal, digits: number): Int =>
  longInteger(n, digits).toString(10);

export const intToDecimal = (n: Int, digits: number): Decimal =>
  shortInteger(n, digits);

export const math64x61toDecimal = (n: Math64x61): Decimal => {
  const long = new BN(n)
    .mul(PRECISSION_BASE_VALUE)
    .div(BASE_MATH_64_61)
    .toString(10);
  return shortInteger(long, PRECISSION_DIGITS);
};

export const decimalToMath64x61 = (n: Decimal): Math64x61 =>
  longInteger(n, PRECISSION_DIGITS)
    .mul(BASE_MATH_64_61)
    .div(PRECISSION_BASE_VALUE)
    .toString(10);

export const math64x61ToInt = (n: Math64x61, digits: number): Int =>
  new BN(n)
    .mul(new BN(10).pow(new BN(digits)))
    .div(BASE_MATH_64_61)
    .toString(10);

export const intToMath64x61 = (n: Int, digits: number): Math64x61 =>
  new BN(n)
    .mul(BASE_MATH_64_61)
    .div(new BN(10).pow(new BN(digits)))
    .toString(10);

export const decimalToUint256 = (n: Decimal, digits: number): uint256.Uint256 =>
  uint256.bnToUint256(longInteger(n, digits));

export const uint256toDecimal = (n: BN, digits: number): Decimal =>
  shortInteger(n.toString(10), digits);
