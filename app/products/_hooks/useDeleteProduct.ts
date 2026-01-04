"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteProduct } from "../fetch";
import type { ProductsResponse } from "../fetch";
import type { Product } from "@/lib/mock-data/products";

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["product", id] });
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous values
      const previousProduct = queryClient.getQueryData<Product>(["product", id]);
      const previousProductsData = queryClient.getQueryData<ProductsResponse>(["products"]);

      // Optimistically remove from products list cache
      if (previousProductsData) {
        const updatedProducts = previousProductsData.products.filter((product) => product.id !== id);

        queryClient.setQueryData<ProductsResponse>(["products"], {
          ...previousProductsData,
          products: updatedProducts,
          total: previousProductsData.total - 1,
        });
      }

      // Remove individual product cache entry
      queryClient.removeQueries({ queryKey: ["product", id] });

      // Return context with snapshots for potential rollback
      return { previousProduct, previousProductsData };
    },
    onError: (_err, id, context) => {
      // Rollback to previous values on error
      if (context?.previousProduct) {
        queryClient.setQueryData<Product>(["product", id], context.previousProduct);
      }
      if (context?.previousProductsData) {
        queryClient.setQueryData<ProductsResponse>(["products"], context.previousProductsData);
      }
    },
    onSuccess: (_data, id) => {
      // Remove individual product cache entry
      queryClient.removeQueries({ queryKey: ["product", id] });

      // Navigate to products list
      router.push("/products");
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

