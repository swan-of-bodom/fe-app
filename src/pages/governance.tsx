import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

import { Layout } from "../components/layout";
import { Proposals } from "../components/Proposal";
import { isMainnet } from "../constants/amm";

type Props = {
  message: string;
  data?: string[];
};

const Governance = () => {
  const SwitchNetwork = ({ message, data }: Props) => (
    <Box
      sx={{
        marginTop: 4,
        padding: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ mb: 4 }}>{message}</Typography>
        {/* <NetworkButton /> */}
        {/* {account && <ClaimButton account={account} data={data} />} */}
      </Box>
    </Box>
  );
  useEffect(() => {
    document.title = "Governance | Carmine Finance";
  });

  return (
    <Layout>
      {isMainnet ? (
        <Proposals />
      ) : (
        <SwitchNetwork message="To see live proposals please switch to mainnet" />
      )}
    </Layout>
  );
};

export default Governance;
