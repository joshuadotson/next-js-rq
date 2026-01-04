# State Management Patterns

This document explains the colocated state management pattern used in this application.

## Philosophy

Server state (data from APIs) should be **colocated with the routes that use it**. This creates:

- ✅ Clear ownership - you know exactly where to find the data logic
- ✅ Better organization - related code stays together
- ✅ Easier maintenance - changes to a feature are localized
- ✅ Reduced coupling - features don't depend on shared state files

## File Structure

```
app/
  posts/
    page.tsx              # Server component - prefetches data
    PostsList.tsx         # Client component - consumes data
    usePosts.ts           # Server state hook - colocated!
    useCreatePost.ts      # Mutation hook - colocated!
    prefetch.ts           # Prefetch functions - colocated!
    fetch.ts              # Fetch functions - colocated!
    [id]/
      page.tsx            # Server component for detail page
      PostDetail.tsx      # Client component for detail page
```

## Server State Hooks

Server state hooks are thin wrappers around `useQuery` that:

1. Define the query key logic
2. Call the fetch function
3. Return the query result

```typescript:app/posts/usePosts.ts
export function usePosts(params?: PostsParams) {
  const normalizedParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      )
    : undefined;

  const queryKey = normalizedParams
    ? ["posts", normalizedParams]
    : ["posts"];

  return useQuery({
    queryKey,
    queryFn: () => fetchPosts(params),
  });
}
```

**Benefits:**
- Query key logic is centralized
- Components don't need to know about fetch functions
- Easy to add additional logic (error handling, transformations, etc.)

## Mutation Hooks

Mutation hooks wrap `useMutation` and handle cache updates:

```typescript:app/posts/useCreatePost.ts
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onMutate: async (newPostData) => {
      // Optimistic update logic
    },
    onError: (err, newPost, context) => {
      // Rollback on error
    },
    onSuccess: (createdPost) => {
      // Replace optimistic post with real one
    },
  });
}
```

**Benefits:**
- Cache update logic is encapsulated
- Components just call `mutate()` - no cache management needed
- Easy to add optimistic updates, error handling, etc.

## Fetch Functions

Fetch functions are pure async functions that make API calls:

```typescript:app/posts/fetch.ts
export async function fetchPosts(
  params?: PostsParams,
  baseUrl?: string
): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();
  // ... build query string
  
  const url = baseUrl
    ? `${baseUrl}/api/posts?${searchParams.toString()}`
    : `/api/posts?${searchParams.toString()}`;
  
  const response = await fetch(url);
  return response.json();
}
```

**Benefits:**
- Reusable by both server (prefetch) and client (hooks)
- `baseUrl` parameter allows absolute URLs for server-side fetch
- Pure functions are easy to test

## Prefetch Functions

Prefetch functions are server-only functions that prepare data for hydration:

```typescript:app/posts/prefetch.ts
export async function prefetchPosts(params?: PostsParams) {
  const queryClient = getQueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params, baseUrl),
  });
  
  return dehydrate(queryClient);
}
```

**Key points:**
- Server-only (uses `getQueryClient()` which returns server client)
- Uses same query keys as hooks (ensures cache match)
- Uses `baseUrl` for absolute fetch URLs

## Component Usage

Components use hooks without knowing about the implementation:

```typescript:app/posts/PostsList.tsx
export function PostsList() {
  const { data, isLoading, error } = usePosts();
  
  // Use data, handle loading/error states
}
```

The component doesn't need to know:
- Where the data comes from
- How it's cached
- Whether it was prefetched or fetched client-side

## Why This Works

1. **Query keys match**: Prefetch and hooks use identical query key logic
2. **Same fetch functions**: Both use the same `fetchPosts` function
3. **Cache hydration**: Dehydrated server cache matches client cache structure
4. **React Query handles it**: The library manages the complexity

## Alternative Patterns (Not Used)

### ❌ Shared State File

```
hooks/
  usePosts.ts
  useCreatePost.ts
```

**Problems:**
- Unclear which routes use which hooks
- Hard to see the full feature in one place
- Easy to create circular dependencies

### ❌ Global State Store

```
store/
  posts.ts
```

**Problems:**
- Overkill for server state (React Query is the store)
- Unnecessary abstraction
- Harder to reason about data flow

## Summary

Colocating server state with routes creates a clear, maintainable structure where:
- Each feature is self-contained
- Related code lives together
- It's obvious where to make changes
- The pattern scales to large applications

