import { WidoWidget, darkTheme, lightTheme } from "wido-widget";
import { useAccount } from "../../hooks/useAccount";
import { debug } from "../../utils/debugger";
import { ethers } from "ethers";
import { useTheme } from "@mui/material";
import { store } from "../../redux/store";
import { NetworkName } from "../../types/network";
import { openMetamaskMissingDialog } from "../../redux/actions";
import { getTokenAddresses } from "../../constants/amm";
import { stripZerosFromAddress } from "../../utils/utils";

const handleConnectWalletClick = () => {
  if (!window.ethereum) {
    debug("MetaMask not present");
    openMetamaskMissingDialog();
    return;
  }
  window.ethereum.request({ method: "eth_requestAccounts" });
};

const getTokens = () => {
  const n = store.getState().network.network.name;
  const tokens = getTokenAddresses();

  switch (n) {
    // devnet uses same tokens as mainnet
    case NetworkName.Devnet:
      return {
        toTokens: [
          {
            chainId: 15366,
            address:
              "0x7aba50fdb4e024c1ba63e2c60565d0fd32566ff4b18aa5818fc80c30e749024",
          },
          {
            chainId: 15366,
            address:
              "0x18a6abca394bd5f822cfa5f88783c01b13e593d1603e7b41b00d31d2ea4827a",
          },
        ],
        fromTokens: [
          { chainId: 1, address: "0x0000000000000000000000000000000000000000" },
          { chainId: 1, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        ],
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
            address: stripZerosFromAddress(tokens.LPTOKEN_CONTRACT_ADDRESS),
          },
          {
            chainId: 15367,
            address: stripZerosFromAddress(tokens.LPTOKEN_CONTRACT_ADDRESS_PUT),
          },
        ],
        fromTokens: [
          { chainId: 5, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
          { chainId: 5, address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F" },
        ],
      };
    case NetworkName.Mainnet:
      return {
        toTokens: [
          {
            chainId: 15366,
            address:
              "0x7aba50fdb4e024c1ba63e2c60565d0fd32566ff4b18aa5818fc80c30e749024",
          },
          {
            chainId: 15366,
            address:
              "0x18a6abca394bd5f822cfa5f88783c01b13e593d1603e7b41b00d31d2ea4827a",
          },
        ],
        fromTokens: [
          { chainId: 1, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
          { chainId: 1, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        ],
      };
    default:
      throw Error("Failed getting wido tokens");
  }
};

const WidoWidgetWrapper = (pool: "call" | "put") => {
  const account = useAccount();
  const theme = useTheme();
  const carmineAddress = getTokenAddresses().MAIN_CONTRACT_ADDRESS;

  const widoTheme = {
    // use base wido theme per user mode
    ...(theme.palette.mode === "dark" ? darkTheme : lightTheme),
    // overrides
    primary: theme.palette.primary.main,
    accent: theme.palette.primary.main,
    outline: theme.palette.primary.main,
  };

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
      theme={widoTheme}
      partner={carmineAddress}
    />
  );
};

export const CallWido = () => WidoWidgetWrapper("call");

export const PutWido = () => WidoWidgetWrapper("put");
