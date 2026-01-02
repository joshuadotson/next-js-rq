"use client";

import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/lib/mock-data/posts";

type PostsResponse = {
  posts: Post[];
  total: number;
  limit: number;
  offset: number;
};

async function fetchPosts(params?: {
  limit?: number;
  offset?: number;
  authorId?: string;
  tag?: string;
}): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());
  if (params?.authorId) searchParams.set("authorId", params.authorId);
  if (params?.tag) searchParams.set("tag", params.tag);

  const response = await fetch(`/api/posts?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

export function usePosts(params?: {
  limit?: number;
  offset?: number;
  authorId?: string;
  tag?: string;
}) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params),
  });
}

