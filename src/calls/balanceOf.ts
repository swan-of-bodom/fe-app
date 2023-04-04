import { UserBalance } from "./../types/wallet";
import BN from "bn.js";
import { AccountInterface, Contract } from "starknet";
import ABI from "../abi/lptoken_abi.json";
import { getTokenAddresses } from "../constants/amm";

const balanceFromTokenAddress = async (
  account: AccountInterface,
  tokenAddress: string
): Promise<BN> => {
  const contract = new Contract(ABI, tokenAddress, account);
  const balance = await contract.balanceOf(account.address);
  return new BN(balance.balance.low);
};

export const balanceOfEth = async (account: AccountInterface): Promise<BN> => {
  const { ETH_ADDRESS } = getTokenAddresses();
  return balanceFromTokenAddress(account, ETH_ADDRESS);
};

export const balanceOfUsdc = async (account: AccountInterface): Promise<BN> => {
  const { USD_ADDRESS } = getTokenAddresses();
  return balanceFromTokenAddress(account, USD_ADDRESS);
};

export const balance = async (
  account?: AccountInterface
): Promise<UserBalance | undefined> => {
  if (!account) {
    return;
  }
  const promises = [balanceOfEth(account), balanceOfUsdc(account)];
  const values = await Promise.all(promises);
  return {
    eth: values[0],
    usd: values[1],
  };
};
