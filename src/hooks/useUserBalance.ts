import { getUserBalance } from "./../calls/balanceOf";
import { useState, useEffect } from "react";
import { UserBalance } from "../types/wallet";
import { getWallet } from "../network/account";

export const useUserBalance = (): UserBalance | undefined => {
  const [balance, setBalance] = useState<UserBalance | undefined>();
  const delay = 30 * 1000; // 10s

  const cb = () => {
    const wallet = getWallet();

    if (!wallet) {
      return;
    }

    getUserBalance(wallet.account).then((res) => setBalance(res));
  };

  useEffect(() => {
    const id = setInterval(cb, delay);

    return () => clearInterval(id);
  });

  return balance;
};
