import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useCreatePost } from "@/app/posts/_hooks/useCreatePost";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useCreatePost", () => {
  it("should create a post successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreatePost(), { wrapper });

    const newPost = {
      title: "New Post",
      content: "New content",
      authorId: "user-1",
    };

    result.current.mutate(newPost);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.title).toBe(newPost.title);
  });

  it("should perform optimistic update", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Pre-populate posts cache
    queryClient.setQueryData(["posts"], {
      posts: [],
      total: 0,
      limit: 10,
      offset: 0,
    });

    const { result } = renderHook(() => useCreatePost(), { wrapper });

    const newPost = {
      title: "Optimistic Post",
      content: "Optimistic content",
      authorId: "user-1",
    };

    result.current.mutate(newPost);

    // Check optimistic update immediately
    await waitFor(() => {
      const postsData = queryClient.getQueryData(["posts"]);
      expect(postsData).toBeDefined();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

