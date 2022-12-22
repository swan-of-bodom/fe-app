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
  margin: 2,
  padding: 2,
}));

const Home = () => {
  useEffect(() => {
    document.title = "Home | Carmine Finance";
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Item>
        <Typography sx={{ padding: "15%" }} variant="h4">
          Welcome to Carmine Finance!
        </Typography>
      </Item>
    </Box>
  );
};

export default Home;
