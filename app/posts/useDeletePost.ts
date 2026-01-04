"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deletePost } from "./fetch";
import type { PostsResponse } from "./fetch";
import type { Post } from "@/lib/mock-data/posts";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["post", id] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous values
      const previousPost = queryClient.getQueryData<Post>(["post", id]);
      const previousPostsData = queryClient.getQueryData<PostsResponse>(["posts"]);

      // Optimistically remove from posts list cache
      if (previousPostsData) {
        const updatedPosts = previousPostsData.posts.filter((post) => post.id !== id);

        queryClient.setQueryData<PostsResponse>(["posts"], {
          ...previousPostsData,
          posts: updatedPosts,
          total: previousPostsData.total - 1,
        });
      }

      // Remove individual post cache entry
      queryClient.removeQueries({ queryKey: ["post", id] });

      // Return context with snapshots for potential rollback
      return { previousPost, previousPostsData };
    },
    onError: (_err, id, context) => {
      // Rollback to previous values on error
      if (context?.previousPost) {
        queryClient.setQueryData<Post>(["post", id], context.previousPost);
      }
      if (context?.previousPostsData) {
        queryClient.setQueryData<PostsResponse>(["posts"], context.previousPostsData);
      }
    },
    onSuccess: (_data, id) => {
      // Remove individual post cache entry
      queryClient.removeQueries({ queryKey: ["post", id] });

      // Navigate to posts list
      router.push("/posts");
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

