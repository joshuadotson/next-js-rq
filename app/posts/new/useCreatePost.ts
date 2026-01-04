"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, type CreatePostData, type Post } from "../../fetch";
import type { PostsResponse } from "../../fetch";
import type { User } from "@/lib/mock-data/users";
import type { UsersResponse } from "@/app/users/fetch";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onMutate: async (newPostData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<PostsResponse>(["posts"]);

      // Try to get user name from users cache for optimistic update
      const usersData = queryClient.getQueryData<UsersResponse>(["users"]);
      const user = usersData?.users.find((u) => u.id === newPostData.authorId);
      const authorName = user
        ? `${user.firstName} ${user.lastName}`
        : "Loading...";

      // Generate temporary ID for optimistic post
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
      const optimisticPost: Post = {
        id: tempId,
        title: newPostData.title,
        content: newPostData.content,
        author: authorName,
        authorId: newPostData.authorId,
        createdAt: now,
        updatedAt: now,
        tags: [],
        likes: 0,
        views: 0,
      };

      // Optimistically update the cache
      if (previousData) {
        queryClient.setQueryData<PostsResponse>(["posts"], {
          ...previousData,
          posts: [optimisticPost, ...previousData.posts],
          total: previousData.total + 1,
        });
      } else {
        // If no previous data, create new cache entry
        queryClient.setQueryData<PostsResponse>(["posts"], {
          posts: [optimisticPost],
          total: 1,
          limit: 1,
          offset: 0,
        });
      }

      // Return context with snapshot for potential rollback
      return { previousData };
    },
    onError: (_err, _newPost, context) => {
      // Rollback to previous value on error
      if (context?.previousData) {
        queryClient.setQueryData<PostsResponse>(["posts"], context.previousData);
      }
    },
    onSuccess: (createdPost) => {
      // Replace optimistic post with real post from server
      const currentData = queryClient.getQueryData<PostsResponse>(["posts"]);

      if (currentData) {
        // Find and replace the optimistic post (with temp ID) with the real one
        const updatedPosts = currentData.posts.map((post) =>
          post.id.startsWith("temp-") ? createdPost : post
        );

        queryClient.setQueryData<PostsResponse>(["posts"], {
          ...currentData,
          posts: updatedPosts,
        });
      }
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

