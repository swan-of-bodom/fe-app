import { RawOption } from "../types/options.d";
import { Box, Stack } from "@mui/material";
import { OptionPreview } from "./optionPreview";
import { useSelector } from "react-redux";

type StateWithRawOptionsList = {
  rawOptionsList: RawOption[];
};

export const OptionsList = () => {
  const { rawOptionsList: list } = useSelector<
    StateWithRawOptionsList,
    StateWithRawOptionsList
  >((s) => s);

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
