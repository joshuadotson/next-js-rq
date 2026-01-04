"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsers, type UsersParams } from "../fetch";

export function useUsers(params?: UsersParams) {
  // Normalize params for query key - filter out undefined values
  const normalizedParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      )
    : undefined;

  const queryKey = normalizedParams
    ? ["users", normalizedParams]
    : ["users"];

  return useQuery({
    queryKey,
    queryFn: () => fetchUsers(params),
  });
}

