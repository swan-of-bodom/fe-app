import { Decimal, Int, Math64x61 } from "../types/units";
import { longInteger, shortInteger } from "./computations";
import { BASE_MATH_64 } from "../constants/amm";
import { BigNumberish, uint256 } from "starknet";

const PRECISSION_DIGITS = 20;
const PRECISSION_BASE_VALUE = BigInt(10) ** BigInt(PRECISSION_DIGITS);

export const decimalToInt = (n: Decimal, digits: number): Int =>
  longInteger(n, digits).toString(10);

export const intToDecimal = (n: Int, digits: number): Decimal =>
  shortInteger(n, digits);

export const math64x61toDecimal = (n: BigNumberish): Decimal => {
  const long = (BigInt(n) * PRECISSION_BASE_VALUE) / BASE_MATH_64;
  return shortInteger(long.toString(10), PRECISSION_DIGITS);
};

export const decimalToMath64x61 = (n: Decimal): Math64x61 => {
  const longInt = longInteger(n, PRECISSION_DIGITS);
  const mul = longInt * BASE_MATH_64;

  const div = mul / PRECISSION_BASE_VALUE;
  return div.toString(10);
};

export const math64x61ToInt = (n: BigNumberish, digits: number): Int =>
  ((BigInt(n) * 10n ** BigInt(digits)) / BASE_MATH_64).toString(10);

export const intToMath64x61 = (n: BigNumberish, digits: number): Math64x61 =>
  ((BigInt(n) * BASE_MATH_64) / 10n ** BigInt(digits)).toString(10);

export const decimalToUint256 = (n: Decimal, digits: number): uint256.Uint256 =>
  uint256.bnToUint256(longInteger(n, digits));

export const uint256toDecimal = (n: bigint, digits: number): Decimal =>
  shortInteger(n.toString(10), digits);
