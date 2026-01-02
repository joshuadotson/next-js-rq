import { getQueryClient } from "@/lib/react-query/query-client";
import { dehydrate } from "@tanstack/react-query";
import { fetchPosts, fetchPost, type PostsParams, type PostsResponse } from "./fetch";
import type { Post } from "@/lib/mock-data/posts";

export async function prefetchPosts(params?: PostsParams) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Normalize params for query key - filter out undefined values
  const normalizedParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      )
    : undefined;

  const queryKey = normalizedParams
    ? ["posts", normalizedParams]
    : ["posts"];

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

