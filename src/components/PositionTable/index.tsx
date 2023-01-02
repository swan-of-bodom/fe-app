import { useAccount } from "@starknet-react/core";
import { FunctionComponent } from "react";
import { fetchPositions } from "./fetchPositions";
import { LiveTable } from "./LiveTable";
import { TableWrapper } from "../TableWrapper";
import { InMoneyTable } from "./InMoneyTable";
import { OutOfMoneyTable } from "./OutOfMoneyTable";
import { Typography } from "@mui/material";
import { useQuery } from "react-query";
import { QueryKeys } from "../../queries/keys";
import { NoContent } from "../TableNoContent";

type PositionsTemplateProps = {
  Live: FunctionComponent;
  InMoney: FunctionComponent;
  OutOfMoney: FunctionComponent;
};

const PositionsTemplate = ({
  Live,
  InMoney,
  OutOfMoney,
}: PositionsTemplateProps) => (
  <>
    <Typography sx={{ flexGrow: 1 }} variant="h4">
      Options Balance
    </Typography>

    <Typography sx={{ maxWidth: "66ch" }}>
      These options have not matured yet. You can either close your position or
      wait for the maturity.
    </Typography>
    <TableWrapper>
      <Live />
    </TableWrapper>
    <Typography variant="h4">Expired - Profit</Typography>
    <Typography sx={{ maxWidth: "66ch" }}>
      These options matured in the money and you will get your funds upon
      settling.
    </Typography>
    <TableWrapper>
      <InMoney />
    </TableWrapper>
    <Typography variant="h4">Expired - No Profit</Typography>
    <Typography sx={{ maxWidth: "66ch" }}>
      These options matured out of the money, you will not receive any funds
      from settling them. Settling these options will simply remove them.
    </Typography>
    <TableWrapper>
      <OutOfMoney />
    </TableWrapper>
  </>
);

type PropsAddress = {
  address: string;
};

const PositionsWithAddress = ({ address }: PropsAddress) => {
  const props = useQuery([QueryKeys.position, address], fetchPositions);

  return (
    <PositionsTemplate
      Live={() => LiveTable(props)}
      InMoney={() => InMoneyTable(props)}
      OutOfMoney={() => OutOfMoneyTable(props)}
    />
  );
};

export const Positions = () => {
  const { address } = useAccount();

  if (!address) {
    const child = () =>
      NoContent({ text: "Connect your wallet to see your positions" });
    return (
      <PositionsTemplate Live={child} InMoney={child} OutOfMoney={child} />
    );
  }

  return <PositionsWithAddress address={address} />;
};
