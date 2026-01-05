This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## About

Next RQ is a demonstration application showcasing how to integrate [TanStack Query](https://tanstack.com/query) (React Query) with Next.js App Router. The app demonstrates best practices for managing server state in a Next.js application, including:

- **Server-side prefetching**: Data is prefetched on the server and hydrated on the client with no duplication
- **Colocated state management**: Server state hooks are organized alongside their routes with a hybrid pattern - shared hooks in `_hooks/` subdirectories, single-use hooks colocated with their pages
- **Optimistic updates**: Mutations use optimistic updates for instant UI feedback
- **API routes**: Next.js API routes provide a mock backend for posts data

## How It Works

The integration relies on several key mechanisms working together:

### 1. Server-Side Prefetching with `prefetchQuery`

The core mechanism is React Query's `prefetchQuery` method, which fetches data on the server before the page renders:

```typescript
// Server component prefetches data
const dehydratedState = await prefetchPosts();

// Prefetch function uses prefetchQuery
await queryClient.prefetchQuery({
  queryKey: ["posts"],
  queryFn: () => fetchPosts(params, baseUrl),
});
```

This ensures data is available **before** the client components mount, eliminating loading states.

### 2. Dehydration and Hydration

The prefetched cache is serialized (dehydrated) on the server and sent to the client:

```typescript
// Server: Dehydrate the cache
return dehydrate(queryClient);

// Client: Hydrate the cache via HydrationBoundary
<HydrationBoundary state={dehydratedState}>
  <PostsList />
</HydrationBoundary>
```

The `HydrationBoundary` component hydrates the client's query cache **before** child components render, so `useQuery` hooks immediately find the data.

### 3. Query Key Consistency

Both server prefetch and client hooks must use **identical query keys**:

```typescript
// Server prefetch
const queryKey = createQueryKey("posts", params);

// Client hook
const queryKey = createQueryKey("posts", params); // Same key!
```

The `createQueryKey` utility ensures consistent normalization, preventing cache mismatches.

### 4. Dual Query Client Pattern

- **Server**: Creates a new `QueryClient` per request (request isolation)
- **Client**: Uses a singleton `QueryClient` (state persistence)

This pattern ensures server requests are isolated while the client maintains cache across navigation.

### 5. Stale Time Configuration

Setting `staleTime: 60 * 1000` prevents React Query from immediately refetching on the client:

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Data is fresh for 1 minute
    },
  },
});
```

Since the prefetched data is considered "fresh", React Query uses it from cache instead of making a duplicate request.

### The Result

When a client component calls `useQuery`, React Query:
1. Checks the cache for matching query key
2. Finds the prefetched data (hydrated from server)
3. Sees the data is fresh (within `staleTime`)
4. **Returns immediately** - no network request needed! ✅

This creates a seamless experience: data appears instantly with zero duplicate requests.

### Verification

You can verify this is working by checking a few things:

#### 1. React Query Devtools

Open the React Query Devtools (floating icon in the bottom corner) and navigate to `/posts`:

- **Queries tab**: You'll see `["posts"]` with data already cached
- **Status**: Shows as "fresh" (not "fetching" or "stale")
- **Data**: The posts data is immediately visible

This confirms the data was prefetched on the server and hydrated on the client.

#### 2. Network Tab

Open your browser's DevTools Network tab and navigate to `/posts`:

- **Initial load**: You'll see the HTML page request
- **No `/api/posts` request**: The data was already fetched on the server!
- **Subsequent navigation**: If you navigate away and back within the `staleTime` window, still no `/api/posts` request (though you'll see the RSC payload request, which is expected for Next.js navigation)

This proves there are **zero duplicate API requests** - the client uses the prefetched data from the server.

#### 3. No Loading States

When you navigate to `/posts`:

- **No loading spinner**: The posts list appears immediately
- **No skeleton screens**: Content is visible right away
- **Instant rendering**: The UI is fully populated on first render

This demonstrates that `useQuery` found the data in cache and returned it synchronously.

#### 4. Server Logs

Check your Next.js server console when navigating to `/posts`:

- You'll see the server-side fetch happening during SSR
- The client receives the HTML with the dehydrated state embedded
- No client-side fetch occurs after hydration

**Try it yourself**: Navigate to `/posts`, open DevTools, and verify there's no `/api/posts` request in the Network tab! 🎯

### Features

- **Posts Management**: Full CRUD operations - browse, view, create, edit, and delete posts with filtering and pagination support
- **Server State Hooks**: Custom React Query hooks colocated with routes for better organization
- **React Query Devtools**: Built-in devtools for debugging queries and mutations
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Documentation

For detailed information about how this integration works, see:

- **[Architecture Overview](./docs/ARCHITECTURE.md)** - Core integration patterns and query client setup
- **[Server-Side Prefetching](./docs/PREFETCHING.md)** - How prefetching and hydration work without duplicate requests
- **[State Management Patterns](./docs/STATE_MANAGEMENT.md)** - Colocated hooks and organization strategy
- **[Optimistic Updates](./docs/OPTIMISTIC_UPDATES.md)** - Implementing instant UI feedback with mutations
- **[Testing Guide](./docs/TESTING.md)** - Comprehensive guide to unit, integration, and E2E testing

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
