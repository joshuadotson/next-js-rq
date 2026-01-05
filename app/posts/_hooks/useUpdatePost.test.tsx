import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useUpdatePost } from "@/app/posts/_hooks/useUpdatePost";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useUpdatePost", () => {
  it("should update a post successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdatePost("1"), { wrapper });

    const updateData = {
      title: "Updated Title",
      content: "Updated content",
      authorId: "user-1",
    };

    result.current.mutate(updateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.title).toBe(updateData.title);
  });

  it("should perform optimistic update", async () => {
    const queryClient = createTestQueryClient();
    const postId = "1";
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Pre-populate post cache
    queryClient.setQueryData(["post", postId], {
      id: postId,
      title: "Original Title",
      content: "Original content",
      authorId: "user-1",
      author: "Jane Doe",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      tags: [],
      likes: 0,
      views: 0,
    });

    const { result } = renderHook(() => useUpdatePost(postId), { wrapper });

    const updateData = {
      title: "Optimistic Title",
      content: "Optimistic content",
      authorId: "user-1",
    };

    result.current.mutate(updateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

