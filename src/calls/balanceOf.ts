import { UserBalance } from "./../types/wallet";
import BN from "bn.js";
import { AccountInterface, Contract } from "starknet";
import ABI from "../abi/lptoken_abi.json";
import { TokenKey } from "../tokens/tokens";
import { ETH_ADDRESS, USDC_ADDRESS } from "../constants/amm";

const CARM_TOKEN_ADDRESS =
  "0x3c0286e9e428a130ae7fbbe911b794e8a829c367dd788e7cfe3efb0367548fa";

const balanceFromTokenAddress = async (
  account: AccountInterface,
  tokenAddress: string
): Promise<BN> => {
  const contract = new Contract(ABI, tokenAddress, account);
  const balance = await contract.balanceOf(account.address);
  return new BN(balance.balance.low);
};

export const balanceOfEth = async (account: AccountInterface): Promise<BN> => {
  return balanceFromTokenAddress(account, ETH_ADDRESS);
};

export const balanceOfUsdc = async (account: AccountInterface): Promise<BN> => {
  return balanceFromTokenAddress(account, USDC_ADDRESS);
};

export const balanceOfCarmineToken = async (
  account: AccountInterface
): Promise<BN> => balanceFromTokenAddress(account, CARM_TOKEN_ADDRESS);

export const getUserBalance = async (
  account: AccountInterface
): Promise<UserBalance | undefined> => {
  const promises = [balanceOfEth(account), balanceOfUsdc(account)];
  const values = await Promise.all(promises);
  return {
    [TokenKey.ETH]: values[0],
    [TokenKey.USDC]: values[1],
  };
};
