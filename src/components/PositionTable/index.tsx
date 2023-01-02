import { useAccount } from "@starknet-react/core";
import { FunctionComponent } from "react";
import { fetchPositions } from "./fetchPositions";
import { TableWrapper } from "../TableWrapper";
import { Box, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { QueryKeys } from "../../queries/keys";
import { NoContent } from "../TableNoContent";
import { LoadingAnimation } from "../loading";
import { CompositeOption } from "../../types/options";
import { isFresh } from "../../utils/parseOption";
import { TableElement } from "./TableElement";
import { LiveItem } from "./LiveItem";
import { InMoneyItem } from "./InMoneyItem";
import { OutOfMoneyItem } from "./OutOfMoneyItem";

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
    <Typography variant="h4">Options Balance</Typography>

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
  const { isLoading, isError, isFetching, data } = useQuery(
    [QueryKeys.position, address],
    fetchPositions
  );

  if (isLoading) {
    const child = () => (
      <Box sx={{ padding: "20px" }}>
        <LoadingAnimation size={40} />
      </Box>
    );
    return (
      <PositionsTemplate Live={child} InMoney={child} OutOfMoney={child} />
    );
  }

  if (isError) {
    const child = () =>
      NoContent({
        text: "Something went wrong while getting your positions, please try again later",
      });
    return (
      <PositionsTemplate Live={child} InMoney={child} OutOfMoney={child} />
    );
  }

  const liveOptions = data
    ? data.filter(({ raw }: CompositeOption) => isFresh(raw))
    : [];

  const inOptions = data
    ? data.filter(
        ({ raw, parsed }: CompositeOption) =>
          !isFresh(raw) && !!parsed?.positionValue
      )
    : [];

  const outOptions = data
    ? data.filter(
        ({ raw, parsed }: CompositeOption) =>
          !isFresh(raw) && !parsed?.positionValue
      )
    : [];

  return (
    <PositionsTemplate
      Live={() =>
        TableElement({
          isFetching,
          data: liveOptions,
          titles: ["Option", "Maturity", "Size", "Value", "Amount"],
          ItemElem: LiveItem,
        })
      }
      InMoney={() =>
        TableElement({
          isFetching,
          data: inOptions,
          titles: ["Option", "Expiry", "Size", "Value"],
          ItemElem: InMoneyItem,
        })
      }
      OutOfMoney={() =>
        TableElement({
          isFetching,
          data: outOptions,
          titles: ["Option", "Expiry", "Size"],
          ItemElem: OutOfMoneyItem,
        })
      }
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
