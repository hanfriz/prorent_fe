"use client";

import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { AuthInitializer } from "./AuthInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
            refetchOnWindowFocus: false, // optional: disable automatic refetch on focus
            retry: 1, // retry failed requests once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={3000}
      >
        {children}
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export function Devtools() {
  const [showDevtools, setShowDevtools] = useState(false);

  function toggleDevtools() {
    setShowDevtools((prev) => !prev);
  }

  return (
    <>
      <button
        onClick={toggleDevtools}
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          zIndex: 9999,
          padding: 10,
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {showDevtools ? "Hide" : "Show"} Devtools
      </button>
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
}
