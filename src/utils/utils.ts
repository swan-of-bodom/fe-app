import { BigNumberish } from "starknet/utils/number";

export const isNonEmptyArray = (v: unknown): v is Array<any> =>
  !!(v && Array.isArray(v) && v.length > 0);

export const handleBlockChainResponse = (v: unknown): BigNumberish | null =>
  v && isNonEmptyArray(v) ? v[0] : null;

export const weiToEth = (bn: BigNumberish, decimalPlaces: number): string => {
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

export const timestampToReadableDate = (ts: number): string => {
  const d = new Date(ts);
  return d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
};

export const hashToReadable = (v: string): string =>
  v.slice(0, 4) + "..." + v.slice(v.length - 4);
