# Server-Side Prefetching

This document explains how server-side prefetching works and why it's efficient.

## The Problem It Solves

Without prefetching, a typical flow would be:

1. Server renders page (no data)
2. Client hydrates
3. Client component mounts
4. `useQuery` runs and fetches data
5. Loading state shown to user
6. Data arrives and UI updates

This results in:
- ❌ Loading states on initial render
- ❌ Extra round trip to the server
- ❌ Slower perceived performance

## The Solution: Prefetch + Hydrate

With our prefetching pattern:

1. Server renders page **with data already fetched**
2. Data is dehydrated and sent to client
3. Client hydrates the cache **before components mount**
4. Client components see data immediately
5. ✅ No loading state, no duplicate request

## Implementation

### Step 1: Prefetch Function

Prefetch functions are server-only functions that fetch data and prepare it for hydration:

```typescript:app/posts/prefetch.ts
export async function prefetchPosts(params?: PostsParams) {
  const queryClient = getQueryClient(); // Gets server query client
  
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const queryKey = createQueryKey("posts", params);
  
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: (): Promise<PostsResponse> => fetchPosts(params, baseUrl),
  });
  
  return dehydrate(queryClient); // Serialize cache for client
}
```

**Important details:**
- Uses `baseUrl` to make absolute requests (required for server-side fetch)
- Uses `createQueryKey` utility to ensure consistent query keys
- Returns dehydrated state (serialized cache)

### Step 2: Server Component Prefetch

Server components call prefetch functions during render:

```typescript:app/posts/page.tsx
export default async function PostsPage() {
  const dehydratedState = await prefetchPosts();
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <PostsList />
    </HydrationBoundary>
  );
}
```

### Step 3: Client Component Consumption

Client components use the same hooks they always would:

```typescript:app/posts/PostsList.tsx
export function PostsList() {
  const { data, isLoading } = usePosts();
  
  // data is immediately available - no loading state!
  // isLoading will be false because data is in cache
}
```

The `usePosts` hook uses the same query key as the prefetch, so React Query finds the data in the hydrated cache.

## Why No Duplicate Requests?

React Query's cache is keyed by query keys. When you:

1. Prefetch with key `["posts"]` on the server
2. Dehydrate and send to client
3. Client hydrates into cache with key `["posts"]`
4. Component calls `useQuery({ queryKey: ["posts"] })`

React Query checks the cache first. It finds data with matching key, sees it's not stale (due to `staleTime: 60 * 1000`), and **returns immediately without fetching**.

## Query Key Consistency

This is why query key normalization is critical. Both the prefetch function and the hook use the `createQueryKey` utility:

```typescript:app/posts/_hooks/usePosts.ts
export function usePosts(params?: PostsParams) {
  const queryKey = createQueryKey("posts", params);

  return useQuery({
    queryKey,
    queryFn: () => fetchPosts(params),
  });
}
```

The `createQueryKey` utility ensures consistent normalization:
- `{ limit: 10, offset: 0 }` → `["posts", { limit: 10, offset: 0 }]`
- `{ limit: 10, offset: 0, authorId: undefined }` → `["posts", { limit: 10, offset: 0 }]`
- `undefined` → `["posts"]`

This guarantees the keys match between server and client.

## Performance Benefits

### Network Efficiency

- **Before**: Server render → Client fetch → Data arrives
- **After**: Server render (with data) → Client receives data immediately

### User Experience

- **Before**: Loading spinner on initial render
- **After**: Content visible immediately

### Bundle Size

- No additional bundle size - we're using React Query's built-in hydration
- The dehydrated state is just JSON, minimal overhead

## Verification

You can verify this works by:

1. Opening React Query Devtools
2. Navigating to `/posts`
3. Checking the queries tab - you'll see `["posts"]` with data already cached
4. No network request in the Network tab for the initial load

The data was fetched on the server and hydrated on the client - zero client-side requests needed!

