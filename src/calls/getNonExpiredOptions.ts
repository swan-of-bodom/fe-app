import BN from "bn.js";
import { API_URL } from "../constants/amm";

export const getNonExpiredOptions = async (): Promise<BN[]> =>
  fetch(`${API_URL}all-non-expired`)
    .then((res) => res.json())
    .then((res) => {
      if (res?.status !== "success" || !res?.data?.length) {
        return [];
      }
      return res.data.map((v: string) => new BN(v));
    });
