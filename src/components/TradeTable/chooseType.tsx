import BN from "bn.js";
import { OptionType } from "../../types/options";
import { hexToBN } from "../../utils/utils";
import { debug } from "../../utils/debugger";
import { API_URL } from "../../constants/amm";

const TIMEOUT = 1000; // abort after 1,5s
const ETH_PRICE_APPROXIMATION = 1900; // approximation of ETH price

const flipCoin = (): OptionType =>
  Math.random() > 0.5 ? OptionType.Call : OptionType.Put;

type StatusData = {
  // only field we care about
  unlocked_cap: string;
};

type StatusResponse = {
  status: string;
  data: StatusData;
};

export const chooseType = async (): Promise<OptionType> => {
  const callPromise = fetch(API_URL + "eth-usdc-call/state", {
    signal: AbortSignal.timeout(TIMEOUT),
  }).then((res) => res.json());
  const putPromise = fetch(API_URL + "eth-usdc-put/state", {
    signal: AbortSignal.timeout(TIMEOUT),
  }).then((res) => res.json());

  const [callResult, putResult] = await Promise.allSettled([
    callPromise,
    putPromise,
  ]);

  if (callResult.status === "rejected" || putResult.status === "rejected") {
    // did not fetch in time - flip a coin
    debug("choosing type - rejected fliping a coin");
    return flipCoin();
  }

  const [call, put] = [
    (callResult as PromiseFulfilledResult<StatusResponse>).value,
    (putResult as PromiseFulfilledResult<StatusResponse>).value,
  ];

  if (call.status !== "success" || put.status !== "success") {
    // unexpected response - flip a coin
    return flipCoin();
  }

  const callUnlocked = hexToBN(call.data.unlocked_cap).mul(
    new BN(ETH_PRICE_APPROXIMATION)
  );
  const putUnlocked = hexToBN(put.data.unlocked_cap).mul(
    new BN(10).pow(new BN(18 - 6))
  );

  debug({
    callUnlocked: callUnlocked.toString(10),
    putUnlocked: putUnlocked.toString(10),
  });

  const chosenType = callUnlocked.gt(putUnlocked)
    ? // more unlocked in the call pool than put pool
      OptionType.Call
    : // more unlocked in the put pool than call pool
      OptionType.Put;

  debug("type decided based on unlocked capital:", {
    call: call.data,
    put: put.data,
    chosenType,
  });
  return chosenType;
};
