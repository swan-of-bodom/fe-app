import { useEffect } from "react";
import { Positions } from "../components/PositionTable";

const Balance = () => {
  useEffect(() => {
    document.title = "Balance | Carmine Finance";
  });

  return <Positions />;
};

export default Balance;
