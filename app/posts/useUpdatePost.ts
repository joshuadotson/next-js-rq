"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost, type UpdatePostData } from "./fetch";
import type { PostsResponse } from "./fetch";
import type { Post } from "@/lib/mock-data/posts";
import type { UsersResponse } from "@/app/users/fetch";

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostData) => updatePost(id, data),
    onMutate: async (updatedData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["post", id] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous values
      const previousPost = queryClient.getQueryData<Post>(["post", id]);
      
      // Get all posts queries (with any params)
      const allPostsQueries = queryClient.getQueriesData<PostsResponse>({
        queryKey: ["posts"],
      });
      const previousPostsQueries = new Map(allPostsQueries);

      // Try to get user name from users cache for optimistic update
      const usersData = queryClient.getQueryData<UsersResponse>(["users"]);
      const user = usersData?.users.find((u) => u.id === updatedData.authorId);
      const authorName = user
        ? `${user.firstName} ${user.lastName}`
        : previousPost?.author || "Loading...";

      // Create optimistic post
      const optimisticPost: Post = previousPost
        ? {
            ...previousPost,
            title: updatedData.title,
            content: updatedData.content,
            author: authorName,
            authorId: updatedData.authorId,
            updatedAt: new Date().toISOString(),
          }
        : {
            id,
            title: updatedData.title,
            content: updatedData.content,
            author: authorName,
            authorId: updatedData.authorId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
            likes: 0,
            views: 0,
          };

      // Optimistically update individual post cache
      queryClient.setQueryData<Post>(["post", id], optimisticPost);

      // Optimistically update ALL posts list caches (with any params)
      queryClient.setQueriesData<PostsResponse>(
        { queryKey: ["posts"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatedPosts = oldData.posts.map((post) =>
            post.id === id ? optimisticPost : post
          );
          return {
            ...oldData,
            posts: updatedPosts,
          };
        }
      );

      // Return context with snapshots for potential rollback
      return { previousPost, previousPostsQueries };
    },
    onError: (_err, _updatedData, context) => {
      // Rollback to previous values on error
      if (context?.previousPost) {
        queryClient.setQueryData<Post>(["post", id], context.previousPost);
      }
      if (context?.previousPostsQueries) {
        // Restore all previous posts queries
        context.previousPostsQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (updatedPost) => {
      // Replace optimistic data with real data from server
      queryClient.setQueryData<Post>(["post", id], updatedPost);

      // Update ALL posts list caches with real data
      queryClient.setQueriesData<PostsResponse>(
        { queryKey: ["posts"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatedPosts = oldData.posts.map((post) =>
            post.id === id ? updatedPost : post
          );
          return {
            ...oldData,
            posts: updatedPosts,
          };
        }
      );
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

