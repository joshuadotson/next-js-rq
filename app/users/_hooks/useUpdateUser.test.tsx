import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useUpdateUser } from "@/app/users/_hooks/useUpdateUser";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useUpdateUser", () => {
  it("should update a user successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateUser("user-1"), { wrapper });

    const updateData = {
      firstName: "Updated",
      lastName: "Name",
      email: "updated@example.com",
    };

    result.current.mutate(updateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.firstName).toBe(updateData.firstName);
  });
});

