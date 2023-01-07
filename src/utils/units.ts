import BN from "bn.js";
import { Decimal, Int, Math64x61 } from "../types/units";
import { longInteger, shortInteger } from "./computations";
import { BASE_MATH_64_61 } from "../constants/amm";

const precission = 10 ** 5;

export const decimalToInt = (n: Decimal, digits: number): Int =>
  longInteger(n, digits).toString(10);

export const intToDecimal = (n: Int, digits: number): Decimal =>
  shortInteger(n, digits);

export const math64x61toDecimal = (n: Math64x61): Decimal =>
  new BN(n).mul(new BN(precission)).div(BASE_MATH_64_61).toNumber() /
  precission;

export const decimalToMath64x61 = (n: Decimal): Math64x61 =>
  new BN(n * precission)
    .mul(BASE_MATH_64_61)
    .div(new BN(precission))
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
