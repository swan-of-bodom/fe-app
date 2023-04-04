import { getApiUrl } from "./../utils/utils";
import BN from "bn.js";

export const getNonExpiredOptions = async (): Promise<BN[]> =>
  fetch(`${getApiUrl()}all-non-expired`)
    .then((res) => res.json())
    .then((res) => {
      if (res?.status !== "success" || !res?.data?.length) {
        return [];
      }
      return res.data.map((v: string) => new BN(v));
    });
