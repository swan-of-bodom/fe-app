import { BigNumberish } from "starknet/utils/number";

export const isNonEmptyArray = (v: unknown): boolean => !!(v && Array.isArray(v) && v.length > 0);

export const weiToEth = (bn: BigNumberish, decimalPlaces: number): string => {
    const v: string = bn.toString().padStart(19, 0);
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
