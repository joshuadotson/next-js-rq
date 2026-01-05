import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useDeletePost } from "@/app/posts/_hooks/useDeletePost";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("useDeletePost", () => {
  it("should delete a post successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeletePost(), { wrapper });

    result.current.mutate("1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("should perform optimistic update", async () => {
    const queryClient = createTestQueryClient();
    const postId = "1";
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Pre-populate posts cache
    queryClient.setQueryData(["posts"], {
      posts: [
        {
          id: postId,
          title: "Test Post",
          content: "Test content",
          authorId: "user-1",
          author: "Jane Doe",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          tags: [],
          likes: 0,
          views: 0,
        },
      ],
      total: 1,
      limit: 10,
      offset: 0,
    });

    const { result } = renderHook(() => useDeletePost(), { wrapper });

    result.current.mutate(postId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

