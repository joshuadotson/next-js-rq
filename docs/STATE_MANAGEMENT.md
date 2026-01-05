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
    _hooks/               # Shared hooks (used in multiple pages)
      usePosts.ts         # List query hook - shared!
      usePost.ts          # Single post hook - shared!
      useCreatePost.ts    # Create mutation hook - shared!
      useUpdatePost.ts    # Update mutation hook - shared!
      useDeletePost.ts    # Delete mutation hook - shared!
    prefetch.ts           # Prefetch functions - colocated!
    fetch.ts              # Fetch functions - colocated!
    [id]/
      page.tsx            # Server component for detail page
      PostDetail.tsx      # Client component for detail page
      edit/
        page.tsx          # Server component for edit page
        EditPostForm.tsx  # Client component for edit form
    new/
      page.tsx            # Client component for create form
```

**Organization Pattern:**
- **Shared hooks** (used in multiple pages) → `app/[route]/_hooks/`
- All mutation hooks (create, update, delete) are typically shared and placed in `_hooks/`
- If a specific page has more than 3 page-specific hooks, use `app/[route]/[action]/_hooks/`

## Server State Hooks

Server state hooks are thin wrappers around `useQuery` that:

1. Define the query key logic
2. Call the fetch function
3. Return the query result

```typescript:app/posts/_hooks/usePosts.ts
export function usePosts(params?: PostsParams) {
  const queryKey = createQueryKey("posts", params);

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

Mutation hooks wrap `useMutation` and handle cache updates. This application includes three mutation hooks:

### Create Mutation

```typescript:app/posts/_hooks/useCreatePost.ts
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onMutate: async (newPostData) => {
      // Optimistic update logic - adds post to list
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

### Update Mutation

```typescript:app/posts/_hooks/useUpdatePost.ts
export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdatePostData) => updatePost(id, data),
    onMutate: async (updatedData) => {
      // Updates both individual post and all posts list caches
      queryClient.setQueriesData({ queryKey: ["posts"] }, ...);
    },
    onSuccess: (updatedPost) => {
      // Replaces optimistic data with server response
    },
  });
}
```

**Key point**: Uses `setQueriesData` to update all posts queries (with or without params), ensuring the list always reflects updates.

### Delete Mutation

```typescript:app/posts/_hooks/useDeletePost.ts
export function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onMutate: async (id) => {
      // Removes post from all caches optimistically
    },
    onSuccess: (_data, id) => {
      // Navigates to posts list after deletion
      router.push("/posts");
    },
  });
}
```

**Benefits:**
- Cache update logic is encapsulated
- Components just call `mutate()` - no cache management needed
- Easy to add optimistic updates, error handling, etc.
- All mutations handle multiple query keys automatically

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
  
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const queryKey = createQueryKey("posts", params);
  
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: (): Promise<PostsResponse> => fetchPosts(params, baseUrl),
  });
  
  return dehydrate(queryClient);
}
```

**Key points:**
- Server-only (uses `getQueryClient()` which returns server client)
- Uses `createQueryKey` utility to ensure same query keys as hooks (ensures cache match)
- Uses `baseUrl` for absolute fetch URLs

## Component Usage

Components use hooks without knowing about the implementation:

```typescript:app/posts/PostsList.tsx
import { usePosts } from "./_hooks/usePosts";

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

## Hook Organization Strategy

This application uses a **shared hooks pattern**:

1. **Shared hooks** (used in multiple pages or components) are grouped in `_hooks/` subdirectories at the route level
   - Example: `app/posts/_hooks/usePosts.ts`, `app/posts/_hooks/usePost.ts`
   - All mutation hooks (create, update, delete) are typically shared and placed here
   - This includes hooks used by multiple pages or components within the route

2. **Action-level `_hooks/`** (if a specific action has more than 3 page-specific hooks)
   - Example: `app/posts/[id]/edit/_hooks/` if the edit page had 4+ page-specific hooks
   - Use this when a specific page/action has more than 3 hooks that are only used on that page

**Benefits:**
- Shared hooks are easy to find in one place
- Consistent organization across all routes
- Clear separation between shared and page-specific logic
- Scales well as features grow

## Summary

Colocating server state with routes creates a clear, maintainable structure where:
- Each feature is self-contained
- Related code lives together
- It's obvious where to make changes
- The pattern scales to large applications
- Shared hooks are grouped for consistency
- Single-use hooks are discoverable next to their pages

