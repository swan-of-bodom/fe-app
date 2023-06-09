import { Contract } from "starknet";
import { getTokenAddresses } from "../constants/amm";
import { store } from "../redux/store";
import AmmAbi from "../abi/amm_abi.json";
import GovernanceAbi from "../abi/amm_abi.json";

export const getMainContract = (): Contract => {
  const provider = store.getState().network.provider;
  const { MAIN_CONTRACT_ADDRESS } = getTokenAddresses();
  return new Contract(AmmAbi, MAIN_CONTRACT_ADDRESS, provider);
};

export const getGovernanceContract = (): Contract => {
  const provider = store.getState().network.provider;
  const { GOVERNANCE_CONTRACT_ADDRESS } = getTokenAddresses();
  return new Contract(GovernanceAbi, GOVERNANCE_CONTRACT_ADDRESS, provider);
};

export const afterTransaction = (
  tx: string,
  ok: () => void,
  nok?: () => void
) => {
  const provider = store.getState().network.provider;
  provider.waitForTransaction(tx).then(ok).catch(nok);
};
