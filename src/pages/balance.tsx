import { useEffect } from "react";
import { Positions } from "../components/PositionTable";
import { Airdrop } from "../components/Airdrop/Airdrop";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });

  return (
    <>
      <Airdrop />
      <Positions />
    </>
  );
};

export default Balance;
