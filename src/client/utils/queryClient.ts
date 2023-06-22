import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      suspense: true,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 5,
    },
  },
});

export default queryClient;
