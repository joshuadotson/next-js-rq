import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useUpdateProduct } from "@/app/products/_hooks/useUpdateProduct";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useUpdateProduct", () => {
  it("should update a product successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateProduct("1"), { wrapper });

    const updateData = {
      name: "Updated Product",
      description: "Updated description",
    };

    result.current.mutate(updateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.name).toBe(updateData.name);
  });
});

