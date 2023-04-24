import BN from "bn.js";
import { AMM_METHODS } from "../constants/amm";
import { getMainContract } from "../utils/blockchain";
import { debug } from "../utils/debugger";
import { isNonEmptyArray } from "../utils/utils";
import { infuraCall } from "./infura";

const method = AMM_METHODS.GET_OPTION_WITH_POSITION_OF_USER;
const selector =
  "0x2b20b26ede4304b68503c401a342731579b75844e5696ee13e6286cd51a9621";

export const getOptionsWithPositionOfUser = async (
  address: string
): Promise<BN[]> => {
  const contract = getMainContract();
  infuraCall(contract.address, selector, [address]);
  const res = await contract.call(method, [address]).catch((e: Error) => {
    debug("Failed while calling", method);
    throw Error(e.message);
  });

  if (isNonEmptyArray(res) && isNonEmptyArray(res[0])) {
    return res[0];
  }
  return [];
};

const benchFn = async (cb: () => Promise<any>) => {
  const d = Date.now();
  await cb();
  return (Date.now() - d) / 1000;
};

const average = (array: number[]) =>
  array.reduce((a, b) => a + b) / array.length;

const report = (arr: number[]) => {
  debug("average:", average(arr));
  debug("max:", Math.max(...arr));
  debug("min:", Math.min(...arr), "\n");
};

export const bench = async () => {
  const address =
    "0x03d1525605db970fa1724693404f5f64cba8af82ec4aab514e6ebd3dec4838ad";
  const contract = getMainContract();
  const n = 5;

  const infura = [];
  const starknet = [];

  const infuraFn = async () =>
    await infuraCall(contract.address, selector, [address]);
  const starknetFn = async () => await getOptionsWithPositionOfUser(address);

  for (let i = 0; i < n; i++) {
    const res = await benchFn(infuraFn);
    infura.push(res);
  }

  for (let i = 0; i < n; i++) {
    const res = await benchFn(starknetFn);
    starknet.push(res);
  }

  debug("Infura:");
  report(infura);
  debug("Starknet:");
  report(starknet);
};
