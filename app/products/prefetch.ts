import { getQueryClient } from "@/lib/react-query/query-client";
import { createQueryKey } from "@/lib/react-query/query-keys";
import { dehydrate } from "@tanstack/react-query";
import { fetchProducts, fetchProduct, type ProductsParams, type ProductsResponse } from "./fetch";
import type { Product } from "@/lib/mock-data/products";

export async function prefetchProducts(params?: ProductsParams) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const queryKey = createQueryKey("products", params);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: (): Promise<ProductsResponse> => fetchProducts(params, baseUrl),
  });

  return dehydrate(queryClient);
}

export async function prefetchProduct(id: string) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: (): Promise<Product> => fetchProduct(id, baseUrl),
  });

  return dehydrate(queryClient);
}

