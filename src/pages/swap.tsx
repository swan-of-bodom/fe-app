import { useNavigate } from "react-router-dom";

import { Layout } from "../components/layout";
import Swapper from "../components/Swapper/Swapper";
import buttonStyles from "../style/button.module.css";

const SwapPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <button
        className={buttonStyles.secondary}
        onClick={() => {
          navigate(`/trade/`);
        }}
      >
        Back
      </button>
      <Swapper />
    </Layout>
  );
};

export default SwapPage;
