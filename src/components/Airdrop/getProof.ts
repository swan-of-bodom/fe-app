import { AccountInterface } from "starknet";
import { coreTeamAddresses } from "../../constants/amm";
import { balanceOfCarmineToken } from "../../calls/balanceOf";
import { hexToBN, standardiseAddress } from "../../utils/utils";
import { debug } from "../../utils/debugger";
import { apiUrl } from "../../api";

type Eligible = {
  eligible: true;
  claimable: string;
  claimed: string;
  proof: string[];
};

type NotEligible = {
  eligible: false;
};

export type ProofResult = Eligible | NotEligible;

export const getProof = async (
  account: AccountInterface
): Promise<ProofResult> => {
  const merkleTreeRequest = fetch(
    apiUrl(`airdrop?address=${account.address}`)
  ).then((r) => r.json());
  const carmBalanceRequest = balanceOfCarmineToken(account);

  const [merkleTreeResponse, claimed] = await Promise.all([
    merkleTreeRequest,
    carmBalanceRequest,
  ]);

  if (merkleTreeResponse.status !== "success") {
    return { eligible: false };
  }

  const isCoreTeam = coreTeamAddresses.includes(
    standardiseAddress(account.address)
  );
  const total = hexToBN(merkleTreeResponse.data[1]);
  const diff = total - claimed;
  // account for tiny differences
  const claimable = isCoreTeam
    ? total.toString(10)
    : diff < 100n
    ? "0"
    : diff.toString(10);

  debug("CARM token claim data:", {
    total: total.toString(10),
    claimed: claimed.toString(10),
    claimable,
  });

  return {
    eligible: true,
    proof: merkleTreeResponse.data,
    claimable,
    claimed: claimed.toString(10),
  };
};
