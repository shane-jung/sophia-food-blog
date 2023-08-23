import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./client/containers/App";
import { AuthProvider } from "./client/contexts/AuthProvider";
import { Provider } from "react-redux";
import { store } from "./client/slices/store";
import { QueryClientProvider } from "react-query";

import queryClient from "./client/utils/queryClient";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
