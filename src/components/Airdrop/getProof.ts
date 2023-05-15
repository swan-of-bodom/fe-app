import { AccountInterface } from "starknet";
import { API_URL_MAINNET } from "../../constants/amm";

type Eligible = {
  eligible: true;
  data: string[];
};

type NotEligible = {
  eligible: false;
};

type ProofResult = Eligible | NotEligible;

export const getProof = async (
  account: AccountInterface
): Promise<ProofResult> => {
  const res = await fetch(
    `${API_URL_MAINNET}airdrop?address=${account.address}`
  ).then((r) => r.json());

  if (res.status === "success") {
    return { eligible: true, data: res.data };
  }

  return { eligible: false };
};
