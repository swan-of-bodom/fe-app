import BN from "bn.js";
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

export const ethToWei = (eth: number): string => {
  if (!eth) {
    return "0";
  }

  const v = eth.toString(10);
  const [lead, dec] = v.split(".");

  if (!dec) {
    return lead + "".padEnd(18, "0");
  }

  const tail = dec.padEnd(18, "0");

  const withLeadingZeros = lead + tail;
  const leadingZeros = withLeadingZeros.match(/^0*([0-9]+)/);

  return leadingZeros && leadingZeros?.length > 1 ? leadingZeros[1] : "0";
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

export const premiaToUsd = (bn: BN): number => {
  const ethInUsd = 157700; // actually in cents
  return (
    new BN(bn)
      .mul(new BN(ethInUsd))
      .div(new BN(2).pow(new BN(61)))
      .toNumber() / 100
  );
};

export const premiaToWei = (bn: BN): string =>
  new BN(bn)
    .mul(new BN(10).pow(new BN(18)))
    .div(new BN(2).pow(new BN(61)))
    .toString(10);
