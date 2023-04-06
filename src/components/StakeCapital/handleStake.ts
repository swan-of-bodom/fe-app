import { getUserBalance } from "./../../calls/balanceOf";
import { debug } from "../../utils/debugger";
import { AccountInterface } from "starknet";
import { OptionType } from "../../types/options";
import { invalidateStake } from "../../queries/client";
import { digitsByType, isCall } from "../../utils/utils";
import { depositLiquidity } from "../../calls/depositLiquidity";
import { decimalToInt } from "../../utils/units";
import { showToast } from "../../redux/actions";
import { ToastType } from "../../redux/reducers/ui";
import { longInteger, shortInteger } from "../../utils/computations";
import { ETH_DIGITS, USD_DIGITS } from "../../constants/amm";

export const handleStake = async (
  account: AccountInterface,
  amount: number,
  type: OptionType,
  setLoading: (v: boolean) => void
) => {
  if (!amount) {
    showToast("Cannot stake 0 amount", ToastType.Warn);
    return;
  }
  debug(
    `Staking ${amount} into ${type === OptionType.Call ? "call" : "put"} pool`
  );
  setLoading(true);

  const balance = await getUserBalance(account);

  if (!balance) {
    setLoading(false);
    showToast("Could not read user wallet balance", ToastType.Error);
    return;
  }

  const bnAmount = longInteger(amount, digitsByType(type));

  if (isCall(type)) {
    // Call - make sure user has enough ETH
    if (balance.eth.lt(bnAmount)) {
      const [has, needs] = [
        shortInteger(balance.eth.toString(10), ETH_DIGITS),
        amount,
      ];
      showToast(
        `Trying to stake ETH ${needs.toFixed(
          4
        )}, but you only have ETH${has.toFixed(4)}`,
        ToastType.Warn
      );
      setLoading(false);
      return;
    }
  } else {
    // Put - make sure user has enough USD
    if (balance.usd.lt(bnAmount)) {
      const [has, needs] = [
        shortInteger(balance.usd.toString(10), USD_DIGITS),
        amount,
      ];
      showToast(
        `Trying to stake $${needs.toFixed(4)}, but you only have $${has.toFixed(
          4
        )}`,
        ToastType.Warn
      );
      setLoading(false);
      return;
    }
  }

  const size = decimalToInt(amount, digitsByType(type));

  const ok = () => {
    invalidateStake();
    setLoading(false);
    showToast("Successfully staked capital", ToastType.Success);
  };

  const nok = () => {
    setLoading(false);
  };

  depositLiquidity(account, size, type, ok, nok);
};
