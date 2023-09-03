import { useState } from "react";
import { AccountInterface } from "starknet";
import { claim } from "../../calls/claim";
import styles from "./airdrop.module.css";

type Props = { account: AccountInterface; data?: string[] };

export const ClaimButton = ({ account, data }: Props) => {
  const [text, setText] = useState("");

  const handleClick = () => {
    if (!data) {
      return;
    }
    setText("Confirm tokens transfer in your wallet");
    claim(account!, data!, setText);
  };

  return (
    <>
      <span
        onClick={handleClick}
        className={!data ? styles.inactive : styles.active}
      >
        Claim now
      </span>
      .{text ? ` ${text}` : ""}
    </>
  );
};
