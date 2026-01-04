"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type PostsParams } from "../fetch";

export function usePosts(params?: PostsParams) {
  // Normalize params for query key - filter out undefined values
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

