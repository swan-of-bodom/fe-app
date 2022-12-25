import { useEffect } from "react";
import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const StakingExplainedPage = () => {
  useEffect(() => {
    document.title = "Staking Explained | Carmine Finance";
  });

  return (
    <Box sx={{ maxWidth: "66ch", fontSize: "18px" }}>
      <RouterLink
        style={{ textDecoration: "none", color: "inherit" }}
        to="/staking"
      >
        <ArrowBack />
      </RouterLink>
      <Typography variant="h4">Staking Explained</Typography>
      <br />
      <Typography>
        Staking capital in a liquidity pool means that you are providing
        liquidity to a decentralized exchange (DEX) by adding your assets (e.g.,
        cryptocurrencies) to a pool that is used to facilitate trades on the
        DEX. By staking your capital in a liquidity pool, you are taking on some
        risk, as the value of your assets may fluctuate and you may not be able
        to sell them for the same price that you bought them for. However,
        staking your capital in a liquidity pool also has the potential to yield
        profit, as you may earn a portion of the fees generated by the DEX for
        facilitating trades. These fees are typically split between the
        liquidity providers (i.e., those who have staked their capital in the
        liquidity pool) and the DEX itself.
      </Typography>
      <br />
      <Typography>
        In general, staking capital in a liquidity pool can be a useful way to
        earn passive income, but it is important to carefully consider the risks
        and potential rewards before making any decisions. It is always a good
        idea to do your own research and due diligence before staking your
        capital in a liquidity pool or any other investment.
      </Typography>
      <br />
      <Typography>
        You can find more information{" "}
        <Link href="https://docs.carmine.finance/carmine-options-amm/how-to-use-app/adding-removing-liquidity-to-from-pools">
          in our documentation.
        </Link>
      </Typography>
    </Box>
  );
};

export default StakingExplainedPage;
