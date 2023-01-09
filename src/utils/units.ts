import BN from "bn.js";
import { Decimal, Int, Math64x61 } from "../types/units";
import { longInteger, shortInteger } from "./computations";
import { BASE_MATH_64_61 } from "../constants/amm";
import { Uint256, bnToUint256 } from "starknet/dist/utils/uint256";

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

export const decimalToUint256 = (n: Decimal, digits: number): Uint256 =>
  bnToUint256(longInteger(n, digits));
