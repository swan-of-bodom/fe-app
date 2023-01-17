import BN from "bn.js";
import {
  ETH_DIGITS,
  USD_BASE_VALUE,
  USD_DIGITS,
  getTokenAddresses,
} from "../constants/amm";
import { Theme } from "@mui/system";
import { ThemeVariants } from "../style/themes";
import { OptionSide, OptionType } from "../types/options";

export const isNonEmptyArray = (v: unknown): v is Array<any> =>
  !!(v && Array.isArray(v) && v.length > 0);

export const handleBlockChainResponse = (v: unknown): BN | null =>
  v && isNonEmptyArray(v) ? v[0] : null;

export const weiToEth = (bn: BN, decimalPlaces: number): string => {
  const v: string = Number(bn)
    .toLocaleString("fullwide", { useGrouping: false })
    .padStart(19, "0");
  const index = v.length - 18;
  const [lead, tail] = [v.slice(0, index), v.slice(index)];
  const dec = tail.substring(0, decimalPlaces);

  if (Number(lead) === 0 && Number(dec) === 0) {
    return "0";
  }

  if (Number(dec) === 0) {
    return lead;
  }

  return `${lead}.${dec}`;
};

export const weiTo64x61 = (wei: string): string => {
  const base = new BN(wei);
  const m = new BN(2).pow(new BN(61));
  const d = new BN(10).pow(new BN(18));

  const res = base.mul(m).div(d).toString(10);
  return res;
};

export const timestampToReadableDate = (ts: number): string => {
  const d = new Date(ts);
  return d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
};

export const hashToReadable = (v: string): string =>
  v.slice(0, 4) + "..." + v.slice(v.length - 4);

export const premiaToUsd = (usdInMath64x61: BN): string => {
  return new BN(usdInMath64x61)
    .mul(new BN(USD_BASE_VALUE))
    .div(new BN(2).pow(new BN(61)))
    .toString(10);
};

export const premiaToWei = (bn: BN): string =>
  new BN(bn)
    .mul(new BN(10).pow(new BN(18)))
    .div(new BN(2).pow(new BN(61)))
    .toString(10);

export const debounce = (cb: (...args: any[]) => void, delay: number = 750) => {
  let timeout: number;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

export const isDarkTheme = (theme: Theme) =>
  theme.palette.mode === ThemeVariants.dark;

export const isCall = (type: OptionType): boolean => type === OptionType.Call;

export const isLong = (side: OptionSide): boolean => side === OptionSide.Long;

export const currencyAddresByType = (type: OptionType) =>
  getTokenAddresses()[isCall(type) ? "ETH_ADDRESS" : "USD_ADDRESS"];

export const digitsByType = (type: OptionType) =>
  isCall(type) ? ETH_DIGITS : USD_DIGITS;

export const toHex = (v: BN) => "0x" + v.toString(16);

export const assert = (condition: boolean, message?: string): void => {
  if (!condition) {
    throw new Error("Assertion failed " + message);
  }
};
