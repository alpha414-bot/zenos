import { QueryClient as ReactQueryClient } from "react-query";

export const QueryClient = new ReactQueryClient({
  defaultOptions: { queries: { refetchInterval: false, staleTime: Infinity } },
});
