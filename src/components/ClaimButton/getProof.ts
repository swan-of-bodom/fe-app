import { AccountInterface } from "starknet";
import { API_URL_MAINNET } from "../../constants/amm";
import { claim } from "../../calls/claim";
import { debug } from "../../utils/debugger";

export const getProof = async (
  account: AccountInterface,
  setText: (txt: string) => void
) => {
  setText("Checking if your wallet is eligible for an airdrop...");
  const res = await fetch(
    `${API_URL_MAINNET}airdrop?address=${account.address}`
  ).then((r) => r.json());

  if (res.status === "bad_request") {
    setText("Currently connected wallet is not eligible for an airdrop");
    return;
  }

  if (res.status === "success") {
    setText("Confirm the transfer in your wallet");
    debug("Airdrop claim calldata", res.data);
    claim(account, res.data, setText);
  }
};
