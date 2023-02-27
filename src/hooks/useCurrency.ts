import { getEthInUsd } from "./../calls/currencies";
import { useState, useEffect } from "react";

export const useEth = (): number | undefined => {
  const delay = 10 * 1000; // 10s
  const [currentEth, setCurrentEth] = useState<number | undefined>(undefined);
  const cb = () => getEthInUsd().then((res) => setCurrentEth(res));

  useEffect(() => {
    cb();
    const id = setInterval(cb, delay);

    return () => clearInterval(id);
  });

  return currentEth;
};
