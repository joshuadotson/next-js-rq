# Architecture Overview

This document explains the core architecture of integrating TanStack Query with Next.js App Router.

## Query Client Pattern

The foundation of this integration is the dual query client pattern that handles server and client environments differently.

### Server-Side Query Client

On the server, we create a **new query client for each request**. This is critical for:

1. **Request isolation**: Each server request gets its own query client, preventing data leakage between users
2. **Fresh data**: Server-side prefetching always uses a clean state
3. **Memory efficiency**: Query clients are garbage collected after the request completes

```typescript:lib/react-query/query-client.ts
export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client per request
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
        },
      },
    });
  }
  // ... client side
}
```

### Client-Side Query Client

On the client, we use a **singleton pattern** to maintain a single query client instance:

1. **State persistence**: The same query client persists across navigation and component remounts
2. **Cache sharing**: All components share the same cache, enabling efficient data reuse
3. **Performance**: Avoids recreating the query client on every render

```typescript:lib/react-query/query-client.ts
else {
  // Browser: use singleton pattern
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
```

## Provider Setup

The `QueryClientProvider` is set up in the root layout, wrapping the entire application:

```typescript:app/providers.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Key points:**
- Uses `useState` with a lazy initializer to ensure the client is created once
- The `getQueryClient()` function automatically returns the correct client (server vs client)
- React Query Devtools are included for development

## Data Flow

1. **Server Component** calls a prefetch function
2. **Prefetch function** creates a server query client and fetches data
3. **Data is dehydrated** into a serializable format
4. **HydrationBoundary** receives the dehydrated state
5. **Client components** use hooks that read from the hydrated cache
6. **No duplicate requests** - the client sees the data is already in cache

## Benefits

- ✅ **Zero duplicate requests**: Server-fetched data is immediately available on the client
- ✅ **Request isolation**: Each server request is independent
- ✅ **Cache efficiency**: Client cache persists across navigation
- ✅ **Type safety**: Full TypeScript support throughout
- ✅ **Developer experience**: React Query Devtools work seamlessly

