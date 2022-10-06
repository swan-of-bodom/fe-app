import { useConnectors, useAccount } from "@starknet-react/core";
import { Button } from "@mui/material";
import { Wallet, OpenInNew } from "@mui/icons-material";

import { isNonEmptyArray } from "../utils/utils";

export const WalletButton = () => {
  const { account } = useAccount();
  const { available, connect, disconnect } = useConnectors();
  const installWalletLink = "https://www.argent.xyz/argent-x/";

  if (account) {
    // wallet connected
    return (
      <Button onClick={disconnect}>
        <Wallet />
        Disconnect
      </Button>
    );
  }

  if (isNonEmptyArray(available)) {
    // not connected && wallet(s) available
    return (
      <>
        {available.map((connector, i) => (
          <Button onClick={() => connect(connector)} key={i}>
            <Wallet />
            {connector.id()}
          </Button>
        ))}
      </>
    );
  }

  // not connected and no wallet available
  return (
    <Button target="_blank" href={installWalletLink}>
      <OpenInNew />
      Install Wallet
    </Button>
  );
};
