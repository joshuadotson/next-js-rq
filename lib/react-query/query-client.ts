import { QueryClient } from "@tanstack/react-query";

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client per request
    // This ensures we don't share state between requests
    return new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000, // 1 minute
        },
      },
    });
  } else {
    // Browser: use singleton pattern to keep the same query client
    if (!window.__REACT_QUERY_CLIENT__) {
      window.__REACT_QUERY_CLIENT__ = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      });
    }
    return window.__REACT_QUERY_CLIENT__;
  }
}

// TypeScript declaration for window
declare global {
  interface Window {
    __REACT_QUERY_CLIENT__?: QueryClient;
  }
}

