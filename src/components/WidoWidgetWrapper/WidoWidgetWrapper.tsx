import { WidoWidget, darkTheme, lightTheme } from "wido-widget";
import { useAccount } from "../../hooks/useAccount";
import { debug } from "../../utils/debugger";
import { ethers } from "ethers";
import { useTheme } from "@mui/material";
import { store } from "../../redux/store";
import { NetworkName } from "../../types/network";
import { openMetamaskMissingDialog } from "../../redux/actions";

const handleConnectWalletClick = () => {
  if (!window.ethereum) {
    debug("MetaMask not present");
    openMetamaskMissingDialog();
    return;
  }
  window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
    debug("MetaMask result:", res);
  });
};

const getTokens = () => {
  const n = store.getState().network.network.name;

  switch (n) {
    case NetworkName.Devnet:
      return {
        toTokens: [],
        fromTokens: [],
      };
    case NetworkName.Testdev:
      return {
        toTokens: [],
        fromTokens: [],
      };
    case NetworkName.Testnet:
      return {
        toTokens: [
          {
            chainId: 15367,
            address:
              "0x3b176f8e5b4c9227b660e49e97f2d9d1756f96e5878420ad4accd301dd0cc17",
          },
          {
            chainId: 15367,
            address:
              "0x30fe5d12635ed696483a824eca301392b3f529e06133b42784750503a24972",
          },
        ],
        fromTokens: [
          { chainId: 5, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
          { chainId: 5, address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F" },
        ],
      };
    case NetworkName.Mainnet:
      // TODO: find mainnet tokens
      return {
        toTokens: [
          {
            chainId: 15367,
            address:
              "0x3b176f8e5b4c9227b660e49e97f2d9d1756f96e5878420ad4accd301dd0cc17",
          },
          {
            chainId: 15367,
            address:
              "0x30fe5d12635ed696483a824eca301392b3f529e06133b42784750503a24972",
          },
        ],
        fromTokens: [
          { chainId: 5, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
          { chainId: 5, address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F" },
        ],
      };
    default:
      throw Error("Failed getting wido tokens");
  }
};

const WidoWidgetWrapper = (pool: "call" | "put") => {
  const account = useAccount();
  const theme = useTheme();

  const ethProvider = window.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum as any)
    : undefined;

  const { toTokens, fromTokens } = getTokens();

  const presetToToken = pool === "call" ? toTokens[0] : toTokens[1];

  return (
    <WidoWidget
      onConnectWalletClick={handleConnectWalletClick}
      ethProvider={ethProvider}
      snAccount={account}
      fromTokens={fromTokens}
      toTokens={toTokens}
      presetToToken={presetToToken}
      theme={theme.palette.mode === "dark" ? darkTheme : lightTheme}
    />
  );
};

export const CallWido = () => WidoWidgetWrapper("call");

export const PutWido = () => WidoWidgetWrapper("put");
