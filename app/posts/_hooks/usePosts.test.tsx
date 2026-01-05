import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { usePosts } from "@/app/posts/_hooks/usePosts";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("usePosts", () => {
  it("should fetch posts successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePosts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.posts).toBeDefined();
    expect(Array.isArray(result.current.data?.posts)).toBe(true);
  });

  it("should handle params correctly", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePosts({ limit: 2, offset: 0 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.limit).toBe(2);
    expect(result.current.data?.offset).toBe(0);
  });

  it("should handle loading state", () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePosts(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });
});

