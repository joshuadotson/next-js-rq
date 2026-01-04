import { getQueryClient } from "@/lib/react-query/query-client";
import { createQueryKey } from "@/lib/react-query/query-keys";
import { dehydrate } from "@tanstack/react-query";
import { fetchUsers, fetchUser, type UsersParams, type UsersResponse } from "./fetch";
import type { User } from "@/lib/mock-data/users";

export async function prefetchUsers(params?: UsersParams) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const queryKey = createQueryKey("users", params);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: (): Promise<UsersResponse> => fetchUsers(params, baseUrl),
  });

  return dehydrate(queryClient);
}

export async function prefetchUser(id: string) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await queryClient.prefetchQuery({
    queryKey: ["user", id],
    queryFn: (): Promise<User> => fetchUser(id, baseUrl),
  });

  return dehydrate(queryClient);
}

