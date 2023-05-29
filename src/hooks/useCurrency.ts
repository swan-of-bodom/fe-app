import { getTokenValueInUsd } from "../tokens/tokenPrices";
import { TokenKey } from "../tokens/tokens";
import { useState, useEffect } from "react";

export const useCurrency = (id: TokenKey): number | undefined => {
  const delay = 1000;
  const [current, setCurrent] = useState<number | undefined>(undefined);
  const cb = () => getTokenValueInUsd(id).then((res) => setCurrent(res));

  useEffect(() => {
    cb();
    const id = setInterval(cb, delay);

    return () => clearInterval(id);
  });

  return current;
};
