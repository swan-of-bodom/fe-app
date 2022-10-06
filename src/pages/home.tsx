import { useAccount } from "@starknet-react/core";
import Typography from "@mui/material/Typography";
import { Box, Paper, styled } from "@mui/material";
import { useEffect } from "react";

const Item = styled(Paper)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: "#EEE",
  minHeight: "10vh",
  margin: "20px",
  padding: "20px",
}));

const Home = () => {
  useEffect(() => {
    document.title = "Home | Carmine Finance";
  });
  const { address } = useAccount();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Item>
        <Typography sx={{ padding: "15%" }} variant="h4">
          Welcome to Carmine Finance!
        </Typography>
      </Item>
      <Item>
        <Typography noWrap>
          Your wallet address is:
          <br />
          {address}
        </Typography>
      </Item>
    </Box>
  );
};

export default Home;
