import { Abi, AccountInterface } from "starknet";
import { AMM_METHODS, getTokenAddresses } from "../../constants/amm";
import { OptionType } from "../../types/options";
import { debug } from "../../utils/debugger";
import AmmAbi from "../../abi/amm_abi.json";
import { invalidateStake } from "../../queries/client";
import { afterTransaction } from "../../utils/blockchain";
import { isCall } from "../../utils/utils";
import BN from "bn.js";
import { Uint256, uint256ToBN } from "starknet/dist/utils/uint256";

// "pooled_token_addr",
// "quote_token_address",
// "base_token_address",
// "option_type",
// "lp_token_amount": "Uint256"

export const withdrawCall = async (
  account: AccountInterface,
  setProcessing: (b: boolean) => void,
  type: OptionType,
  size: Uint256
) => {
  setProcessing(true);
  const { ETH_ADDRESS, USD_ADDRESS, MAIN_CONTRACT_ADDRESS } =
    getTokenAddresses();

  const bnSize = uint256ToBN(size);

  if (!size || bnSize.eq(new BN(0))) {
    return;
  }

  const call = isCall(type);

  const calldata = [
    call ? ETH_ADDRESS : USD_ADDRESS,
    USD_ADDRESS,
    ETH_ADDRESS,
    "0x" + type,
    bnSize.toString(10),
    "0", // uint256 trailing 0
  ];
  const withdraw = {
    contractAddress: MAIN_CONTRACT_ADDRESS,
    entrypoint: AMM_METHODS.WITHDRAW_LIQUIDITY,
    calldata,
  };
  debug(`Calling ${AMM_METHODS.WITHDRAW_LIQUIDITY}`, withdraw);
  const res = await account.execute(withdraw, [AmmAbi] as Abi[]).catch((e) => {
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
