import { describe, it, expect } from "vitest";
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductsParams,
} from "@/app/products/fetch";
import { server } from "@/__tests__/setup";
import { http, HttpResponse } from "msw";

describe("fetchProducts", () => {
  it("should fetch all products", async () => {
    const result = await fetchProducts();

    expect(result.products).toBeDefined();
    expect(result.total).toBeDefined();
    expect(Array.isArray(result.products)).toBe(true);
  });

  it("should handle pagination params", async () => {
    const params: ProductsParams = { limit: 2, offset: 0 };
    const result = await fetchProducts(params);

    expect(result.products.length).toBeLessThanOrEqual(2);
    expect(result.limit).toBe(2);
    expect(result.offset).toBe(0);
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.get("/api/products", () => {
        return HttpResponse.json({ error: "Server error" }, { status: 500 });
      })
    );

    await expect(fetchProducts()).rejects.toThrow("Failed to fetch products");
  });
});

describe("fetchProduct", () => {
  it("should fetch a single product by id", async () => {
    const result = await fetchProduct("1");

    expect(result.id).toBe("1");
    expect(result.name).toBeDefined();
    expect(result.description).toBeDefined();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.get("/api/products/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(fetchProduct("999")).rejects.toThrow("Failed to fetch product");
  });
});

describe("createProduct", () => {
  it("should create a new product", async () => {
    const newProduct = {
      name: "Test Product",
      description: "Test description",
    };

    const result = await createProduct(newProduct);

    expect(result.name).toBe(newProduct.name);
    expect(result.description).toBe(newProduct.description);
    expect(result.id).toBeDefined();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.post("/api/products", () => {
        return HttpResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      })
    );

    await expect(
      createProduct({ name: "Test", description: "Test" })
    ).rejects.toThrow();
  });
});

describe("updateProduct", () => {
  it("should update an existing product", async () => {
    const updateData = {
      name: "Updated Product",
      description: "Updated description",
    };

    const result = await updateProduct("1", updateData);

    expect(result.name).toBe(updateData.name);
    expect(result.description).toBe(updateData.description);
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.put("/api/products/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(
      updateProduct("999", { name: "Test", description: "Test" })
    ).rejects.toThrow();
  });
});

describe("deleteProduct", () => {
  it("should delete a product", async () => {
    await expect(deleteProduct("1")).resolves.not.toThrow();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.delete("/api/products/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(deleteProduct("999")).rejects.toThrow();
  });
});

