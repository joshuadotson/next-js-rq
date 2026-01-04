"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ProductsParams } from "../fetch";

export function useProducts(params?: ProductsParams) {
  // Normalize params for query key - filter out undefined values
  const normalizedParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      )
    : undefined;

  const queryKey = normalizedParams
    ? ["products", normalizedParams]
    : ["products"];

  return useQuery({
    queryKey,
    queryFn: () => fetchProducts(params),
  });
}

