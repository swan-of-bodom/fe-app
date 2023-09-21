import { useEffect } from "react";
import { Positions } from "../components/PositionTable";
import { Airdrop } from "../components/Airdrop/Airdrop";
import { Layout } from "../components/layout";
import { TradeHistory } from "../components/TradeHistory/TradeHistory";

const Portfolio = () => {
  useEffect(() => {
    document.title = "Portfolio | Carmine Finance";
    // Check if the URL contains the #history hash
    if (window.location.hash === "#history") {
      // Scroll to the "History" section
      const historySection = document.getElementById("history");
      if (historySection) {
        historySection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <Layout>
      <Airdrop />
      <Positions />
      <h3 id="history">History</h3>
      <p>
        Please be advised that it takes 5-20 minutes for a transaction to
        appear.
      </p>
      <TradeHistory />
    </Layout>
  );
};

export default Portfolio;
