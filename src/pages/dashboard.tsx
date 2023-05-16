import { useEffect } from "react";
import { Header } from "../components/header";

const TradeDashboardPage = () => {
  useEffect(() => {
    document.title = "Trading Dashboard | Carmine Finance";
  });

  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight + 8 : 0;
  const height = `calc(100vh - ${headerHeight}px)`;

  return (
    <>
      <Header />
      <iframe
        title="trading dashboard"
        frameBorder="0"
        width="100%"
        style={{ height }}
        src="https://simple-trading-dashboard-cazsppxr7a-ew.a.run.app/"
      ></iframe>
    </>
  );
};

export default TradeDashboardPage;
