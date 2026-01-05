import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useDeleteProduct } from "@/app/products/_hooks/useDeleteProduct";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("useDeleteProduct", () => {
  it("should delete a product successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteProduct(), { wrapper });

    result.current.mutate("1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

