import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useCreateProduct } from "@/app/products/_hooks/useCreateProduct";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("useCreateProduct", () => {
  it("should create a product successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreateProduct(), { wrapper });

    const newProduct = {
      name: "New Product",
      description: "New description",
    };

    result.current.mutate(newProduct);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.name).toBe(newProduct.name);
  });
});

