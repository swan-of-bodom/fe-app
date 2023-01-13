import { debug } from "../../utils/debugger";
import { AccountInterface } from "starknet";
import { OptionType } from "../../types/options";
import { invalidateStake } from "../../queries/client";
import { digitsByType } from "../../utils/utils";
import { depositLiquidity } from "../../calls/depositLiquidity";
import { decimalToInt } from "../../utils/units";

export const handleStake = async (
  account: AccountInterface,
  amount: number,
  type: OptionType,
  setLoading: (v: boolean) => void
) => {
  debug(
    `Staking ${amount} into ${type === OptionType.Call ? "call" : "put"} pool`
  );
  setLoading(true);

  const size = decimalToInt(amount, digitsByType(type));

  const ok = () => {
    invalidateStake();
    setLoading(false);
  };

  const nok = () => {
    setLoading(false);
  };

  depositLiquidity(account, size, type, ok, nok);
};
