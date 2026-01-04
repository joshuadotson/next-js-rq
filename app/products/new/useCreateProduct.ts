"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, type CreateProductData, type Product } from "../fetch";
import type { ProductsResponse } from "../fetch";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => createProduct(data),
    onMutate: async (newProductData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<ProductsResponse>(["products"]);

      // Generate temporary ID for optimistic product
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
      const optimisticProduct: Product = {
        id: tempId,
        name: newProductData.name,
        description: newProductData.description,
        createdAt: now,
        updatedAt: now,
      };

      // Optimistically update the cache
      if (previousData) {
        queryClient.setQueryData<ProductsResponse>(["products"], {
          ...previousData,
          products: [optimisticProduct, ...previousData.products],
          total: previousData.total + 1,
        });
      } else {
        // If no previous data, create new cache entry
        queryClient.setQueryData<ProductsResponse>(["products"], {
          products: [optimisticProduct],
          total: 1,
          limit: 1,
          offset: 0,
        });
      }

      // Return context with snapshot for potential rollback
      return { previousData };
    },
    onError: (_err, _newProduct, context) => {
      // Rollback to previous value on error
      if (context?.previousData) {
        queryClient.setQueryData<ProductsResponse>(["products"], context.previousData);
      }
    },
    onSuccess: (createdProduct) => {
      // Replace optimistic product with real product from server
      const currentData = queryClient.getQueryData<ProductsResponse>(["products"]);

      if (currentData) {
        // Find and replace the optimistic product (with temp ID) with the real one
        const updatedProducts = currentData.products.map((product) =>
          product.id.startsWith("temp-") ? createdProduct : product
        );

        queryClient.setQueryData<ProductsResponse>(["products"], {
          ...currentData,
          products: updatedProducts,
        });
      }
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

