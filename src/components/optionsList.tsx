import { RawOption } from "../types/options.d";
import { Box, Stack } from "@mui/material";
import { OptionPreview } from "./optionPreview";
import { useSelector } from "react-redux";
import { store } from "../redux/store";
import { OptionsListFetchState } from "../redux/reducers/optionsList";

type StateWithRawOptionsList = {
  rawOptionsList: RawOption[];
};

export const OptionsList = () => {
  const { rawOptionsList: list } = useSelector<
    StateWithRawOptionsList,
    StateWithRawOptionsList
  >((s) => s);

  const fetchState = store.getState().state;

  if (fetchState !== OptionsListFetchState.Done) {
    if (fetchState === OptionsListFetchState.NotStarted) {
      return <p>We will get the options in a jiffy!</p>
    }
    if (fetchState === OptionsListFetchState.Fetching) {
      return <p>Getting the list of available options...</p>
    }
    if (fetchState === OptionsListFetchState.Failed) {
      return <p>Something went wrong while getting the options.</p>
    }
  }

  if (list.length === 0) {
    return <p>It seems that there are currently no available options.</p>
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
