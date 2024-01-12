import { Box, Button, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AccountInterface } from "starknet";

import GovernanceAbi from "../../abi/amm_abi.json";
import { balanceOfCarmineToken } from "../../calls/balanceOf";
import { GOVERNANCE_ADDRESS } from "../../constants/amm";
import { useAccount } from "../../hooks/useAccount";
import { Proposal } from "../../types/proposal";
import { debug } from "../../utils/debugger";

enum Opinion {
  YAY = "1",
  NAY = "2",
}
var ZERO =  BigInt('0');
const vote = async (
  account: AccountInterface,
  propId: number,
  opinion: Opinion
) => {
  var bal=ZERO;
  if(account) {
    bal = await balanceOfCarmineToken(account!);
  }
  if(bal>0){
    const call = {
      contractAddress: GOVERNANCE_ADDRESS,
          entrypoint: "vote",
      calldata: [propId, opinion],
    };
  
    const res = await account.execute(call, [GovernanceAbi]).catch((e) => {
      debug("Vote rejected or failed", e.message);
    });
    debug(res);  
  } else {
    debug("Insufficent Balance");
  }
};

export const Vote = ({ discordLink, id }: Proposal) => {
  const account = useAccount();
  const [balCarmine, setBalance] = useState(ZERO);
  const voteButtonSx = { m: 2 };
  useEffect(() => {
    async function getBalance() {
      const bal = await balanceOfCarmineToken(account!);
      setBalance(bal);
    }
    getBalance()
  }, [account]);
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
      {!!discordLink && (
        <>
          <Typography>
            To see proposal details and discuss go to the{" "}
            <Link target="_blank" href={discordLink}>
              Discord thread
            </Link>
            .
          </Typography>
        </>
      )}
      {account && balCarmine === ZERO && <Typography>Only Carmine Token holders can vote. </Typography>}
      {account && balCarmine > ZERO &&(
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
            onClick={() => vote(account!, id, Opinion.YAY)}
            sx={voteButtonSx}
            variant="contained"
            disabled={!account || balCarmine === ZERO}
          >
            Vote Yes
          </Button>
          <Button
            onClick={() => vote(account!, id, Opinion.NAY)}
            sx={voteButtonSx}
            variant="contained"
            disabled={!account  || balCarmine === ZERO}
          >
            Vote No
          </Button>
      </Box>
      )}
    </Box>
  );
};
