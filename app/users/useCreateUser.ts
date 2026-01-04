"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, type CreateUserData, type User } from "./fetch";
import type { UsersResponse } from "./fetch";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onMutate: async (newUserData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<UsersResponse>(["users"]);

      // Generate temporary ID for optimistic user
      const tempId = `temp-${Date.now()}`;
      const optimisticUser: User = {
        id: tempId,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        email: newUserData.email,
      };

      // Optimistically update the cache
      if (previousData) {
        queryClient.setQueryData<UsersResponse>(["users"], {
          ...previousData,
          users: [...previousData.users, optimisticUser],
          total: previousData.total + 1,
        });
      } else {
        // If no previous data, create new cache entry
        queryClient.setQueryData<UsersResponse>(["users"], {
          users: [optimisticUser],
          total: 1,
          limit: 1,
          offset: 0,
        });
      }

      // Return context with snapshot for potential rollback
      return { previousData };
    },
    onError: (_err, _newUser, context) => {
      // Rollback to previous value on error
      if (context?.previousData) {
        queryClient.setQueryData<UsersResponse>(["users"], context.previousData);
      }
    },
    onSuccess: (createdUser) => {
      // Replace optimistic user with real user from server
      const currentData = queryClient.getQueryData<UsersResponse>(["users"]);

      if (currentData) {
        // Find and replace the optimistic user (with temp ID) with the real one
        const updatedUsers = currentData.users.map((user) =>
          user.id.startsWith("temp-") ? createdUser : user
        );

        queryClient.setQueryData<UsersResponse>(["users"], {
          ...currentData,
          users: updatedUsers,
        });
      }
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

