import { AccountInterface } from "starknet";
import { afterTransaction } from "../utils/blockchain";
import GovernanceAbi from "../abi/governance_abi.json";

export const claim = async (
  account: AccountInterface,
  calldata: string[],
  setText: (txt: string) => void
) => {
  const contractAddress =
    "0x001405ab78ab6ec90fba09e6116f373cda53b0ba557789a4578d8c1ec374ba0f";
  const call = {
    contractAddress,
    entrypoint: "claim",
    calldata,
  };
  const res = await account.execute(call, [GovernanceAbi]).catch(() => null);

  if (res === null) {
    setText("Transaction was rejected");
    return;
  }

  if (res && res.transaction_hash) {
    setText("Transaction is being processed, please be patient...");
    afterTransaction(
      res.transaction_hash,
      () => setText("Airdrop successfully sent to your wallet!"),
      () => setText("Transaction failed")
    );
  } else {
    setText(
      "Something went wrong, please get in touch in the Support chanell on our Discord"
    );
  }
};
