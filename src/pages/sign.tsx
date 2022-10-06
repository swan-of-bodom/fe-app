import { TypedData } from "starknet/utils/typedData";
import { useSignTypedData, useStarknet } from "@starknet-react/core";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, ButtonGroup, TextField } from "@mui/material";

const Sign = () => {
  const [message, setMessage] = useState("Hello, Bob!");

  const typedData: TypedData = {
    types: {
      StarkNetDomain: [
        { name: "name", type: "felt" },
        { name: "version", type: "felt" },
        { name: "chainId", type: "felt" },
      ],
      Person: [
        { name: "name", type: "felt" },
        { name: "wallet", type: "felt" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "felt" },
      ],
    },
    primaryType: "Mail",
    domain: {
      name: "StarkNet Mail",
      version: "1",
      chainId: 1,
    },
    message: {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: message,
    },
  };

  const { account } = useStarknet();
  const { data, error, signTypedData, reset } = useSignTypedData(typedData);

  return (
    <>
      <Typography variant="h4">Message Signing</Typography>
      {error && <Typography noWrap>Error: {error}</Typography>}
      {data && <Typography noWrap>Error: {data}</Typography>}
      {account && (
        <>
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
              label="Message"
              id="outlined-size-small"
              size="small"
              type="text"
              value={message}
              onChange={(evt) => setMessage(evt.target.value)}
            />
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
            >
              <Button variant="contained" onClick={signTypedData}>
                Sign Message
              </Button>
              <Button variant="contained" onClick={reset}>
                Reset
              </Button>
            </ButtonGroup>
          </Box>
        </>
      )}
    </>
  );
};

export default Sign;
