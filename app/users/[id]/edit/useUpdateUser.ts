"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, type UpdateUserData } from "../../../fetch";
import type { UsersResponse } from "../../../fetch";
import type { User } from "@/lib/mock-data/users";

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(id, data),
    onMutate: async (updatedData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["user", id] });
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous values
      const previousUser = queryClient.getQueryData<User>(["user", id]);
      
      // Get all users queries (with any params)
      const allUsersQueries = queryClient.getQueriesData<UsersResponse>({
        queryKey: ["users"],
      });
      const previousUsersQueries = new Map(allUsersQueries);

      // Create optimistic user
      const optimisticUser: User = previousUser
        ? {
            ...previousUser,
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            email: updatedData.email,
          }
        : {
            id,
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            email: updatedData.email,
          };

      // Optimistically update individual user cache
      queryClient.setQueryData<User>(["user", id], optimisticUser);

      // Optimistically update ALL users list caches (with any params)
      queryClient.setQueriesData<UsersResponse>(
        { queryKey: ["users"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatedUsers = oldData.users.map((user) =>
            user.id === id ? optimisticUser : user
          );
          return {
            ...oldData,
            users: updatedUsers,
          };
        }
      );

      // Return context with snapshots for potential rollback
      return { previousUser, previousUsersQueries };
    },
    onError: (_err, _updatedData, context) => {
      // Rollback to previous values on error
      if (context?.previousUser) {
        queryClient.setQueryData<User>(["user", id], context.previousUser);
      }
      if (context?.previousUsersQueries) {
        // Restore all previous users queries
        context.previousUsersQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (updatedUser) => {
      // Replace optimistic data with real data from server
      queryClient.setQueryData<User>(["user", id], updatedUser);

      // Update ALL users list caches with real data
      queryClient.setQueriesData<UsersResponse>(
        { queryKey: ["users"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatedUsers = oldData.users.map((user) =>
            user.id === id ? updatedUser : user
          );
          return {
            ...oldData,
            users: updatedUsers,
          };
        }
      );
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

