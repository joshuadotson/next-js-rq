"use client";

import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/react-query/query-keys";
import { fetchUsers, type UsersParams } from "../fetch";

export function useUsers(params?: UsersParams) {
  const queryKey = createQueryKey("users", params);

  return useQuery({
    queryKey,
    queryFn: () => fetchUsers(params),
  });
}

