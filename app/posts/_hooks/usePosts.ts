"use client";

import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/react-query/query-keys";
import { fetchPosts, type PostsParams } from "../fetch";

export function usePosts(params?: PostsParams) {
  const queryKey = createQueryKey("posts", params);

  return useQuery({
    queryKey,
    queryFn: () => fetchPosts(params),
  });
}

