"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteUser } from "../fetch";
import type { UsersResponse } from "../fetch";
import type { User } from "@/lib/mock-data/users";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["user", id] });
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous values
      const previousUser = queryClient.getQueryData<User>(["user", id]);
      const previousUsersData = queryClient.getQueryData<UsersResponse>(["users"]);

      // Optimistically remove from users list cache
      if (previousUsersData) {
        const updatedUsers = previousUsersData.users.filter((user) => user.id !== id);

        queryClient.setQueryData<UsersResponse>(["users"], {
          ...previousUsersData,
          users: updatedUsers,
          total: previousUsersData.total - 1,
        });
      }

      // Remove individual user cache entry
      queryClient.removeQueries({ queryKey: ["user", id] });

      // Return context with snapshots for potential rollback
      return { previousUser, previousUsersData };
    },
    onError: (_err, id, context) => {
      // Rollback to previous values on error
      if (context?.previousUser) {
        queryClient.setQueryData<User>(["user", id], context.previousUser);
      }
      if (context?.previousUsersData) {
        queryClient.setQueryData<UsersResponse>(["users"], context.previousUsersData);
      }
    },
    onSuccess: (_data, id) => {
      // Remove individual user cache entry
      queryClient.removeQueries({ queryKey: ["user", id] });

      // Navigate to users list
      router.push("/users");
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

