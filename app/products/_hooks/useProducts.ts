"use client";

import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/react-query/query-keys";
import { fetchProducts, type ProductsParams } from "../fetch";

export function useProducts(params?: ProductsParams) {
  const queryKey = createQueryKey("products", params);

  return useQuery({
    queryKey,
    queryFn: () => fetchProducts(params),
  });
}

