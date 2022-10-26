import { RawOption } from "../types/options";
import { Box, Stack } from "@mui/material";
import { OptionPreview } from "./optionPreview";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FetchState } from "../redux/reducers/optionsList";

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

  if (state !== FetchState.Done) {
    return <p>{stateToText(state)}</p>;
  }

  if (list.length === 0) {
    return <p>It seems that there are currently no available options.</p>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {list.map((o: RawOption, i: number) => (
          <OptionPreview rawOption={o} key={i} />
        ))}
      </Stack>
    </Box>
  );
};
