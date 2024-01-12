import { AccountInterface } from "starknet";
import { Proposal } from "../../types/proposal";
import { Vote } from "../Vote/Vote";

type Props = {
  proposal: Proposal;
  balance: bigint;
  account?: AccountInterface;
};

export const ProposalItem = ({ proposal, balance, account }: Props) => (
  <div>
    <h3>Proposal {proposal.id}</h3>
    <div>
      <Vote proposal={proposal} balance={balance} account={account} />
    </div>
  </div>
);
