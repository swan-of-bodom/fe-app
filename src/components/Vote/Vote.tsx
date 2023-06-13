import { Box, Button, Link, Typography } from "@mui/material";
import { AccountInterface } from "starknet";
import { debug } from "../../utils/debugger";
import { useAccount } from "../../hooks/useAccount";
import GovernanceAbi from "../../abi/amm_abi.json";
import { getTokenAddresses } from "../../constants/amm";

enum Opinion {
  YAY = "1",
  // "-1" felt
  NAY = "0x800000000000011000000000000000000000000000000000000000000000000",
}

const vote = async (account: AccountInterface, opinion: Opinion) => {
  const propId = "13";

  const call = {
    contractAddress: getTokenAddresses().GOVERNANCE_CONTRACT_ADDRESS,
    entrypoint: "vote",
    calldata: [propId, opinion],
  };

  const res = await account.execute(call, [GovernanceAbi]).catch((e) => {
    debug("Vote rejected or failed", e.message);
  });
  debug(res);
};

const voteYes = async (account: AccountInterface) => vote(account, Opinion.YAY);
const voteNo = async (account: AccountInterface) => vote(account, Opinion.NAY);

export const Vote = () => {
  const account = useAccount();

  const voteButtonSx = { m: 2 };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexFlow: "column",
        my: 8,
        mx: 2,
      }}
    >
      <Typography>
        Proposal fixes standard proposal passing, you can read more about this
        in the{" "}
        <Link
          target="_blank"
          href="https://discord.com/channels/969228248552706078/1035256265082949722/1116669484124622889"
        >
          Discord anouncement
        </Link>
      </Typography>
      {!account && <Typography>Connect your wallet to vote</Typography>}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "row",
          gap: 2,
        }}
      >
        <Button
          onClick={() => voteYes(account!)}
          sx={voteButtonSx}
          variant="contained"
          disabled={!account}
        >
          Vote Yes
        </Button>
        <Button
          onClick={() => voteNo(account!)}
          sx={voteButtonSx}
          variant="contained"
          disabled={!account}
        >
          Vote No
        </Button>
      </Box>
    </Box>
  );
};
