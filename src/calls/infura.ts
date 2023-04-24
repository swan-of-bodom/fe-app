// Example of "get_option_with_position_of_user" with address "0x03d1525605db970fa1724693404f5f64cba8af82ec4aab514e6ebd3dec4838ad"
// curl -s https://starknet-mainnet.infura.io/v3/df11605e57a14558b13a24a111661f52 \
//     -X POST \
//     -H "Content-Type: application/json" \
//     -d '{"jsonrpc":"2.0","method":"starknet_call", "params": [{
//   "contract_address": "0x76dbabc4293db346b0a56b29b6ea9fe18e93742c73f12348c8747ecfc1050aa",
//   "entry_point_selector": "0x2b20b26ede4304b68503c401a342731579b75844e5696ee13e6286cd51a9621",
//   "calldata": ["0x03d1525605db970fa1724693404f5f64cba8af82ec4aab514e6ebd3dec4838ad"]
import { store } from "../redux/store";
import { NetworkName } from "../types/network";
import { debug } from "../utils/debugger";

const getUrl = () => {
  const network = store.getState().network.network.name;
  switch (network) {
    case NetworkName.Testnet:
      return "https://starknet-goerli.infura.io/v3/df11605e57a14558b13a24a111661f52";
    case NetworkName.Mainnet:
      return "https://starknet-mainnet.infura.io/v3/df11605e57a14558b13a24a111661f52";
    default:
      return "https://starknet-mainnet.infura.io/v3/df11605e57a14558b13a24a111661f52";
  }
};

const getRequestBody = (
  contractAddress: string,
  selector: string,
  calldata: string[]
) => ({
  jsonrpc: "2.0",
  method: "starknet_call",
  params: [
    {
      contract_address: contractAddress,
      entry_point_selector: selector,
      calldata,
    },
    "latest",
  ],
});

export const infuraCall = async (
  contractAddress: string,
  selector: string,
  calldata: string[]
) => {
  const url = getUrl();
  const res = await fetch(url, {
    body: JSON.stringify(getRequestBody(contractAddress, selector, calldata)),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((r) => r.json())
    .catch((e) => {
      debug("Infura call failed", e);
      return { ok: false };
    });

  debug("Infura result:", res);

  if (res.ok && res.result) {
    return res.result;
  }

  throw Error("infura call failed");
};
