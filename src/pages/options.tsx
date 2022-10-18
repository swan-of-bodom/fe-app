import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IsOptionAvailable } from "../components/isOptionAvailable";

const Options = () => {
  useEffect(() => {
    document.title = "Options | Carmine Finance";
  });
  const [maturity, setMaturity] = useState("");
  const [strike, setStrike] = useState("");
  const [isAvailable, setIsAvailable] = useState<JSX.Element | null>(null);

  const handleClick = () => {
    setIsAvailable(
      <IsOptionAvailable maturity={maturity} strikePrice={strike} />
    );
    console.log(isAvailable);
  };

  return (
    <>
      <Typography variant="h4">Options</Typography>
      <p>Check the availability of an option.</p>
      <p>Try these values:</p>
      <ul>
        <li>maturity 1665511435</li>
        <li>strike price 0xbb8000000000000000</li>
      </ul>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          display: "flex",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Maturity"
          id="outlined-size-small"
          size="small"
          type="text"
          value={maturity}
          onChange={(e) => setMaturity(e.target.value)}
        />
        <TextField
          label="Strike"
          id="outlined-size-small"
          size="small"
          type="text"
          value={strike}
          onChange={(e) => setStrike(e.target.value)}
        />
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled elevation buttons"
        >
          <Button variant="contained" onClick={handleClick}>Check</Button>
        </ButtonGroup>
      </Box>
      {isAvailable}
    </>
  );
};

export default Options;
