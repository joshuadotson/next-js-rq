import { getQueryClient } from "@/lib/react-query/query-client";
import { createQueryKey } from "@/lib/react-query/query-keys";
import { dehydrate } from "@tanstack/react-query";
import { fetchPosts, fetchPost, type PostsParams, type PostsResponse } from "./fetch";
import type { Post } from "@/lib/mock-data/posts";

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

export async function prefetchPost(id: string) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await queryClient.prefetchQuery({
    queryKey: ["post", id],
    queryFn: (): Promise<Post> => fetchPost(id, baseUrl),
  });

  return dehydrate(queryClient);
}

