"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "./fetch";

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
}

