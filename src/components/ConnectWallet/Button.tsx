import { AccountInfo } from "./AccountInfo";
import { useAccount } from "../../hooks/useAccount";
import { openWalletConnectDialog } from "../../redux/actions";
import styles from "./connect.module.css";

export const WalletButton = () => {
  const account = useAccount();

  if (account) {
    // wallet connected
    return <AccountInfo />;
  }

  return (
    <button className={styles.button} onClick={openWalletConnectDialog}>
      Connect
    </button>
  );
};
