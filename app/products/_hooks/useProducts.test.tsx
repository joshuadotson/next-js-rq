import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "@/app/products/_hooks/useProducts";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useProducts", () => {
  it("should fetch products successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.products).toBeDefined();
    expect(Array.isArray(result.current.data?.products)).toBe(true);
  });

  it("should handle params correctly", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useProducts({ limit: 2, offset: 0 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.limit).toBe(2);
    expect(result.current.data?.offset).toBe(0);
  });
});

