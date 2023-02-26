import { debug } from "../../utils/debugger";
import { AccountInterface } from "starknet";
import { OptionType } from "../../types/options";
import { invalidateStake } from "../../queries/client";
import { digitsByType } from "../../utils/utils";
import { depositLiquidity } from "../../calls/depositLiquidity";
import { decimalToInt } from "../../utils/units";
import { showToast } from "../../redux/actions";
import { ToastType } from "../../redux/reducers/ui";

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
