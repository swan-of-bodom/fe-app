import { OptionSide } from "../types/options";
import { Box, Button, Stack } from "@mui/material";
import { OptionPreview } from "./optionPreview";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FetchState } from "../redux/reducers/optionsList";
import { useState } from "react";
import { composeOption } from "../utils/parseOption";

const stateToText = (fs: FetchState): string => {
  switch (fs) {
    case FetchState.NotStarted:
      return "We will get the options in a jiffy!";
    case FetchState.Fetching:
      return "Getting the list of available options...";
    default:
      return "Something went wrong while getting the options.";
  }
};

export const OptionsList = () => {
  const list = useSelector((s: RootState) => s.rawOptionsList);
  const state = useSelector((s: RootState) => s.state);
  const [longShort, setLongShort] = useState<OptionSide>(OptionSide.Long);

  if (state !== FetchState.Done) {
    return <p>{stateToText(state)}</p>;
  }

  if (list.length === 0) {
    return <p>It seems that there are currently no available options.</p>;
  }

  const filtered = list
    .map(composeOption)
    .filter(({ parsed }) => parsed.optionSide === longShort);

  return (
    <>
      <Button
        variant="contained"
        onClick={() =>
          longShort === OptionSide.Long
            ? setLongShort(OptionSide.Short)
            : setLongShort(OptionSide.Long)
        }
      >
        {longShort === OptionSide.Long ? "Long" : "Short"}
      </Button>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          {filtered.map(({ raw }, i: number) => (
            <OptionPreview rawOption={raw} key={i} />
          ))}
        </Stack>
      </Box>
    </>
  );
};
