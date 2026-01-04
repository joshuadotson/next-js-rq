"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../fetch";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}

