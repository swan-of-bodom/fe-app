import { AccountInfo } from "./AccountInfo";
import styles from "./connect.module.css";
import { connect as accountConnect } from "../../network/account";
import { connect } from "starknetkit";
import { useAccount } from "../../hooks/useAccount";

export const WalletButton = () => {
  const account = useAccount();

  const handleConnect = async () => {
    const wallet = await connect({ modalMode: "alwaysAsk" });

    if (wallet && wallet.isConnected) {
      accountConnect(wallet);
    }
  };

  if (account) {
    // wallet connected
    return <AccountInfo />;
  }

  return (
    <button className={styles.button} onClick={handleConnect}>
      Connect
    </button>
  );
};
