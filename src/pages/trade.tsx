import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AlternativeTradingView } from "../components/CryptoGraph/AlternativeTradingView";
import { Layout } from "../components/layout";
import TradeTable from "../components/TradeTable";
import buttonStyles from "../style/button.module.css";

const TradePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Buy | Carmine Finance";
  });

  return (
    <Layout>
      <div style={{ paddingBottom: "24px" }}>
        <button
          className={buttonStyles.secondary}
          onClick={() => {
            navigate(`/trade/swap`);
          }}
        >
          Swap tokens
        </button>
      </div>
      <div style={{ width: "100%", height: "500px" }}>
        <AlternativeTradingView />
      </div>
      <TradeTable />
    </Layout>
  );
};

export default TradePage;
