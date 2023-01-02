import { QueryClient, QueryClientConfig } from "react-query";

// 15 minutes
const staleTime = 15 * 60 * 1000;

const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime,
    },
  },
};

export const queryClient = new QueryClient(queryConfig);
