import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useUsers } from "@/app/users/_hooks/useUsers";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useUsers", () => {
  it("should fetch users successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.users).toBeDefined();
    expect(Array.isArray(result.current.data?.users)).toBe(true);
  });
});

