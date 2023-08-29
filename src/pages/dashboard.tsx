import { useEffect } from "react";
import { Header } from "../components/Header/Header";
import { isDev } from "../utils/utils";

const TradeDashboardPage = () => {
  useEffect(() => {
    document.title = "Trading Dashboard | Carmine Finance";
  });

  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight + 8 : 80;
  const height = `calc(100vh - ${headerHeight}px)`;

  const url = isDev
    ? "https://dashboard.carmine-dev.eu/"
    : "https://dashboard.carmine.finance/";

  return (
    <>
      <Header />
      <iframe
        title="trading dashboard"
        frameBorder="0"
        width="100%"
        style={{ height }}
        src={url}
      ></iframe>
    </>
  );
};

export default TradeDashboardPage;
