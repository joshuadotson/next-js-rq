"use client";

import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/lib/mock-data/posts";

async function fetchPost(id: string): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
}

