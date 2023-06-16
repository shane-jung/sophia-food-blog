import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

export default queryClient;
