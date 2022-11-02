import { ProviderInterface } from "starknet";
import { Provider } from "starknet";
import { devProviderOptions } from "../constants/amm";

export const getProvider = (): ProviderInterface | undefined => {
  switch (process.env.NODE_ENV) {
    case "development":
      return new Provider(devProviderOptions);

    default:
      return undefined;
  }
};
