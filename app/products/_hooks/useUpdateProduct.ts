"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct, type UpdateProductData } from "../fetch";
import type { ProductsResponse } from "../fetch";
import type { Product } from "@/lib/mock-data/products";

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductData) => updateProduct(id, data),
    onMutate: async (updatedData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["product", id] });
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous values
      const previousProduct = queryClient.getQueryData<Product>(["product", id]);
      
      // Get all products queries (with any params)
      const allProductsQueries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: ["products"],
      });
      const previousProductsQueries = new Map(allProductsQueries);

      // Create optimistic product
      const optimisticProduct: Product = previousProduct
        ? {
            ...previousProduct,
            name: updatedData.name,
            description: updatedData.description,
            updatedAt: new Date().toISOString(),
          }
        : {
            id,
            name: updatedData.name,
            description: updatedData.description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

      // Optimistically update individual product cache
      queryClient.setQueryData<Product>(["product", id], optimisticProduct);

      // Optimistically update ALL products list caches (with any params)
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatedProducts = oldData.products.map((product) =>
            product.id === id ? optimisticProduct : product
          );
          return {
            ...oldData,
            products: updatedProducts,
          };
        }
      );

      // Return context with snapshots for potential rollback
      return { previousProduct, previousProductsQueries };
    },
    onError: (_err, _updatedData, context) => {
      // Rollback to previous values on error
      if (context?.previousProduct) {
        queryClient.setQueryData<Product>(["product", id], context.previousProduct);
      }
      if (context?.previousProductsQueries) {
        // Restore all previous products queries
        context.previousProductsQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (updatedProduct) => {
      // Replace optimistic data with real data from server
      queryClient.setQueryData<Product>(["product", id], updatedProduct);

      // Update ALL products list caches with real data
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return oldData;
          const updatedProducts = oldData.products.map((product) =>
            product.id === id ? updatedProduct : product
          );
          return {
            ...oldData,
            products: updatedProducts,
          };
        }
      );
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

