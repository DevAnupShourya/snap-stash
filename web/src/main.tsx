import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from '@tanstack/react-router'

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
import { store, persistor } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Provider> */}
    <Provider store={store}>
      <PersistGate loading={<h1>PersistGate Loader......</h1>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
    {/* </Provider> */}
  </React.StrictMode>,
);
