import { useEffect } from "react";
import { Positions } from "../components/PositionTable";
import { Airdrop } from "../components/Airdrop/Airdrop";
import { Layout } from "../components/layout";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });

  return (
    <Layout>
      <Airdrop />
      <Positions />
    </Layout>
  );
};

export default Balance;
