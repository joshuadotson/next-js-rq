# Optimistic Updates

This document explains how optimistic updates work in this application and why they provide a better user experience.

## What Are Optimistic Updates?

Optimistic updates allow the UI to update **immediately** when a mutation is triggered, before the server responds. If the mutation fails, the UI rolls back to the previous state.

## The User Experience

### Without Optimistic Updates

1. User clicks "Create Post"
2. Button shows loading state
3. User waits for server response (100-500ms)
4. Post appears in list
5. **Total time**: ~300ms perceived delay

### With Optimistic Updates

1. User clicks "Create Post"
2. Post appears in list **immediately**
3. Server request happens in background
4. If successful, real post replaces optimistic one
5. If failed, optimistic post is removed
6. **Total time**: ~0ms perceived delay

## Implementation

### The Mutation Hook

```typescript:app/posts/_hooks/useCreatePost.ts
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    
    onMutate: async (newPostData) => {
      // 1. Cancel outgoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      
      // 2. Snapshot current data for rollback
      const previousData = queryClient.getQueryData<PostsResponse>(["posts"]);
      
      // 3. Create optimistic post
      const optimisticPost: Post = {
        id: `temp-${Date.now()}`,
        title: newPostData.title,
        content: newPostData.content,
        // ... other fields
      };
      
      // 4. Update cache optimistically
      if (previousData) {
        queryClient.setQueryData<PostsResponse>(["posts"], {
          ...previousData,
          posts: [optimisticPost, ...previousData.posts],
          total: previousData.total + 1,
        });
      }
      
      // 5. Return context for potential rollback
      return { previousData };
    },
    
    onError: (err, newPost, context) => {
      // Rollback to previous state on error
      if (context?.previousData) {
        queryClient.setQueryData<PostsResponse>(["posts"], context.previousData);
      }
    },
    
    onSuccess: (createdPost) => {
      // Replace optimistic post with real post from server
      const currentData = queryClient.getQueryData<PostsResponse>(["posts"]);
      
      if (currentData) {
        const updatedPosts = currentData.posts.map((post) =>
          post.id.startsWith("temp-") ? createdPost : post
        );
        
        queryClient.setQueryData<PostsResponse>(["posts"], {
          ...currentData,
          posts: updatedPosts,
        });
      }
    },
  });
}
```

## Step-by-Step Breakdown

### 1. `onMutate` - The Optimistic Update

This runs **synchronously** before the mutation function:

- **Cancel queries**: Prevents refetches that might overwrite our update
- **Snapshot data**: Saves current state for potential rollback
- **Create optimistic post**: Generates a temporary post with a `temp-` ID
- **Update cache**: Immediately adds the post to the cache
- **Return context**: Provides data needed for error handling

### 2. `onError` - The Rollback

If the mutation fails:

- Restores the previous data from the snapshot
- User sees the UI revert to the pre-mutation state
- Error can be displayed to the user

### 3. `onSuccess` - The Replacement

When the server responds successfully:

- Finds the optimistic post (by `temp-` ID prefix)
- Replaces it with the real post from the server
- Real post has the correct ID, timestamps, etc.

## Why Temporary IDs?

We use `temp-${Date.now()}` as the ID because:

1. **Uniqueness**: Timestamp ensures no collisions
2. **Identification**: Easy to find and replace later
3. **No conflicts**: Won't match any real post IDs (which are numeric)

## Error Handling

The rollback mechanism ensures:

- ✅ User sees immediate feedback
- ✅ If something goes wrong, state is restored
- ✅ No data corruption or inconsistent UI
- ✅ User can retry the operation

## Benefits

### Performance

- **Perceived latency**: 0ms (instant feedback)
- **Actual latency**: Still ~300ms, but user doesn't wait
- **Network efficiency**: Same number of requests

### User Experience

- ✅ Instant feedback feels responsive
- ✅ No loading spinners for simple mutations
- ✅ Errors are handled gracefully with rollback

### Developer Experience

- ✅ All logic in one place (the mutation hook)
- ✅ Components don't need to handle loading/error states for optimistic updates
- ✅ React Query Devtools show the optimistic state

## Update and Delete Mutations

This application also uses optimistic updates for **update** and **delete** operations:

### Update Mutation

The `useUpdatePost` hook updates both the individual post cache and all posts list caches:

```typescript:app/posts/_hooks/useUpdatePost.ts
onMutate: async (updatedData) => {
  // Cancel queries
  await queryClient.cancelQueries({ queryKey: ["post", id] });
  await queryClient.cancelQueries({ queryKey: ["posts"] });
  
  // Update individual post cache
  queryClient.setQueryData<Post>(["post", id], optimisticPost);
  
  // Update ALL posts list caches (handles query keys with params)
  queryClient.setQueriesData<PostsResponse>(
    { queryKey: ["posts"] },
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        posts: oldData.posts.map((post) =>
          post.id === id ? optimisticPost : post
        ),
      };
    }
  );
}
```

**Key point**: Using `setQueriesData` ensures all posts queries (with or without params) are updated, not just the base `["posts"]` query.

### Delete Mutation

The `useDeletePost` hook removes the post from all caches and navigates away:

```typescript:app/posts/_hooks/useDeletePost.ts
onMutate: async (id) => {
  // Remove from posts list cache
  queryClient.setQueriesData<PostsResponse>(
    { queryKey: ["posts"] },
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        posts: oldData.posts.filter((post) => post.id !== id),
        total: oldData.total - 1,
      };
    }
  );
  
  // Remove individual post cache
  queryClient.removeQueries({ queryKey: ["post", id] });
}

onSuccess: (_data, id) => {
  // Navigate to posts list after successful deletion
  router.push("/posts");
}
```

## When to Use Optimistic Updates

**Good candidates:**
- ✅ Creating new items (posts, comments, etc.)
- ✅ Updating existing items (with proper rollback)
- ✅ Deleting items (with confirmation dialog and navigation)
- ✅ Toggling boolean states (like/unlike)
- ✅ Simple operations that are likely to succeed

**Consider carefully:**
- ⚠️ Complex validations (where failure is likely)
- ⚠️ Operations that depend on server-side calculations
- ⚠️ Operations where rollback would be confusing (use confirmation dialogs)

## Testing Optimistic Updates

You can test the rollback by:

1. Opening React Query Devtools
2. Creating, updating, or deleting a post
3. In DevTools, manually fail the mutation
4. Observe the UI rollback

Or simulate a network error in the browser DevTools Network tab.

**Try it:**
- Edit a post and watch it update in both the detail page and the list immediately
- Delete a post and see it disappear instantly, then navigate to the list
- If a mutation fails, watch the UI rollback to the previous state

## Summary

Optimistic updates provide instant UI feedback by:
1. Updating the cache immediately
2. Sending the request in the background
3. Replacing with real data on success
4. Rolling back on error

This creates a responsive, modern user experience with minimal code complexity.

