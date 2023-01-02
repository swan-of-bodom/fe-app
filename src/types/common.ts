import { CompositeOption } from "./options";

export interface QueryProps {
  isLoading: boolean;
  isError: boolean;
  data: any | undefined;
}

export interface QueryCompositeList extends QueryProps {
  data: CompositeOption[] | undefined;
}
