import { AccountInterface } from "starknet";
import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import AmmAbi from "../../abi/amm_abi.json";
import { invalidateStake } from "../../queries/client";
import { afterTransaction } from "../../utils/blockchain";
import { isCall } from "../../utils/utils";

export const withdrawCall = async (
  account: AccountInterface,
  setProcessing: (b: boolean) => void,
  type: OptionType,
  size: string
) => {
  setProcessing(true);
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  if (!size) {
    return;
  }

  const call = isCall(type);

  const calldata = [
    call ? ETH_ADDRESS : USD_ADDRESS,
    USD_ADDRESS,
    ETH_ADDRESS,
    "0x" + type,
    size,
    "0", // uint256 trailing 0
  ];
  const withdraw = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.WITHDRAW_LIQUIDITY,
    calldata,
  };
  debug(`Calling ${AMM_METHODS.WITHDRAW_LIQUIDITY}`, withdraw);
  const res = await account.execute(withdraw, [AmmAbi]).catch((e) => {
    debug("Withdraw rejected by user or failed\n", e.message);
    setProcessing(false);
  });

  if (res?.transaction_hash) {
    afterTransaction(res.transaction_hash, () => {
      invalidateStake();
      setProcessing(false);
    });
  }
};
