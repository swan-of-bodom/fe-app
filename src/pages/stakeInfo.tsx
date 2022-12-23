import { useEffect } from "react";
import { Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const StakingExplainedPage = () => {
  useEffect(() => {
    document.title = "Staking Explained | Carmine Finance";
  });

  return (
    <>
      <RouterLink
        style={{ textDecoration: "none", color: "inherit" }}
        to="/staking"
      >
        <ArrowBack />
      </RouterLink>
      <Typography variant="h4">Staking Explained</Typography>
      <br />
      <Typography>
        Staking capital in options trading means that you are using your assets
        (e.g., cash or stocks) to purchase options contracts, which give you the
        right (but not the obligation) to buy or sell a security at a
        predetermined price at some point in the future. By staking your capital
        in options trading, you are taking on some risk, as the value of your
        assets may fluctuate and the options you have purchased may expire
        worthless. However, staking your capital in options trading also has the
        potential to yield profit, as you may earn a profit if the options you
        have purchased increase in value or if you are able to sell them for a
        higher price than you paid.
      </Typography>
      <br />
      <Typography>
        In general, staking capital in options trading can be a useful way to
        potentially earn profit, but it is important to carefully consider the
        risks and potential rewards before making any decisions. Options trading
        involves a high level of risk and is not suitable for all investors. It
        is always a good idea to do your own research and due diligence before
        staking your capital in options trading or any other investment.
      </Typography>
      <br />
      <Typography>
        You can find more information{" "}
        <RouterLink to="https://docs.carmine.finance/carmine-options-amm/how-to-use-app/adding-removing-liquidity-to-from-pools">
          in our documentation.
        </RouterLink>
      </Typography>
    </>
  );
};

export default StakingExplainedPage;
