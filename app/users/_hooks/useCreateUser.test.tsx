import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useCreateUser } from "@/app/users/_hooks/useCreateUser";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useCreateUser", () => {
  it("should create a user successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreateUser(), { wrapper });

    const newUser = {
      firstName: "New",
      lastName: "User",
      email: "new.user@example.com",
    };

    result.current.mutate(newUser);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.firstName).toBe(newUser.firstName);
  });
});

