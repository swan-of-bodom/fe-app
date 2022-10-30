import { CompositeOptionWithBalance } from "../types/options";
import { isNonEmptyArray } from "../utils/utils";
import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { updateListBalance } from "../calls/getOptionTokenBalance";
import { useAccount } from "@starknet-react/core";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { FetchState } from "../redux/reducers/optionsList";
import { SingleOwnedOption } from "./ownedOptionsSingle";
import { composeOption, hasHighLow } from "../utils/parseOption";

const GenericErrorMessage = () => (
  <p>"Huh, I seem to have misplaced all the options..."</p>
);

const stateToText = (fs: FetchState): string => {
  switch (fs) {
    case FetchState.NotStarted:
      return "We will get your balance in a jiffy!";
    case FetchState.Fetching:
      return "Getting the balance of the available options...";
    default:
      return "Something went wrong while getting the balance.";
  }
};

export const OwnedOptions = () => {
  const { address } = useAccount();
  const raw = useSelector((s: RootState) => s.rawOptionsList);
  const state = useSelector((s: RootState) => s.balanceState);
  useEffect(() => {
    if (state === FetchState.NotStarted && address) {
      updateListBalance(address);
    }
  });

  if (!address) {
    return <p>Connect a wallet to see your options!</p>;
  }

  if (state !== FetchState.Done) {
    return <p>{stateToText(state)}</p>;
  }

  if (!isNonEmptyArray(raw)) {
    return <GenericErrorMessage />;
  }

  const composite = raw.map(composeOption);

  if (!isNonEmptyArray(composite)) {
    return <GenericErrorMessage />;
  }

  const withBalance = composite.filter((c): c is CompositeOptionWithBalance =>
    hasHighLow(c.raw)
  );

  if (!isNonEmptyArray(withBalance)) {
    return (
      <p>
        There seem to be no options linked to the wallet you are currently
        using.
      </p>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {withBalance.map(({ raw }, i: number) => (
          <SingleOwnedOption raw={raw} key={i} />
        ))}
      </Stack>
    </Box>
  );
};
