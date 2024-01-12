import { NoContent } from "../TableNoContent";
import { activeProposal } from "./fetchProposal";
import ProposalTable from "./ProposalTable";

export const Proposals = () => {
  if (activeProposal.length === 0) {
    return <NoContent text="No proposals are currently live" />;
  }
  return <ProposalTable activeData={activeProposal} />;
};
