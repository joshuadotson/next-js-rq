import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useDeleteUser } from "@/app/users/_hooks/useDeleteUser";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("useDeleteUser", () => {
  it("should delete a user successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    result.current.mutate("user-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

