import type { Product } from "@/lib/mock-data/products";

export type ProductsResponse = {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
};

export type ProductsParams = {
  limit?: number;
  offset?: number;
};

export async function fetchProducts(
  params?: ProductsParams,
  baseUrl?: string
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());

  const url = baseUrl
    ? `${baseUrl}/api/products?${searchParams.toString()}`
    : `/api/products?${searchParams.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function fetchProduct(id: string, baseUrl?: string): Promise<Product> {
  const url = baseUrl ? `${baseUrl}/api/products/${id}` : `/api/products/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export type CreateProductData = {
  name: string;
  description: string;
};

export async function createProduct(
  data: CreateProductData,
  baseUrl?: string
): Promise<Product> {
  const url = baseUrl ? `${baseUrl}/api/products` : `/api/products`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to create product" }));
    throw new Error(error.error || "Failed to create product");
  }

  return response.json();
}

export type UpdateProductData = {
  name: string;
  description: string;
};

export async function updateProduct(
  id: string,
  data: UpdateProductData,
  baseUrl?: string
): Promise<Product> {
  const url = baseUrl ? `${baseUrl}/api/products/${id}` : `/api/products/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to update product" }));
    throw new Error(error.error || "Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(
  id: string,
  baseUrl?: string
): Promise<void> {
  const url = baseUrl ? `${baseUrl}/api/products/${id}` : `/api/products/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to delete product" }));
    throw new Error(error.error || "Failed to delete product");
  }
}

