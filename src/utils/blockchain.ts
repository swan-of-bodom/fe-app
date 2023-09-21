import { Contract } from "starknet";
import { store } from "../redux/store";
import AmmAbi from "../abi/amm_abi.json";
import GovernanceAbi from "../abi/amm_abi.json";
import { AMM_ADDRESS, GOVERNANCE_ADDRESS } from "../constants/amm";

export const getMainContract = (): Contract => {
  const provider = store.getState().network.provider;
  return new Contract(AmmAbi, AMM_ADDRESS, provider);
};

export const getGovernanceContract = (): Contract => {
  const provider = store.getState().network.provider;
  return new Contract(GovernanceAbi, GOVERNANCE_ADDRESS, provider);
};

export const afterTransaction = (
  tx: string,
  ok: () => void,
  nok?: () => void
) => {
  const provider = store.getState().network.provider;
  provider.waitForTransaction(tx).then(ok).catch(nok);
};
