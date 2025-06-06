import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// ? After enabling it getting error 
// import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { ToastProvider } from "@heroui/toast";
import { AuthProvider } from "@/context/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  }
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Provider> */}
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider placement='bottom-center' />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
    {/* </Provider> */}
  </React.StrictMode>,
);
