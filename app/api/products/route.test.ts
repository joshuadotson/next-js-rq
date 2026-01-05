import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/products/route";
import { mockProducts } from "@/lib/mock-data/products";

describe("GET /api/products", () => {
  describe("GET", () => {
    it("should return all products with pagination", async () => {
      const request = new Request("http://localhost/api/products");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeDefined();
      expect(data.total).toBe(mockProducts.length);
      expect(data.products.length).toBeGreaterThan(0);
    });

    it("should paginate products with limit and offset", async () => {
      const request = new Request("http://localhost/api/products?limit=2&offset=0");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toHaveLength(2);
      expect(data.limit).toBe(2);
      expect(data.offset).toBe(0);
    });
  });

  describe("POST", () => {
    it("should create a new product", async () => {
      const newProduct = {
        name: "Test Product",
        description: "Test description",
      };

      const request = new Request("http://localhost/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe(newProduct.name);
      expect(data.description).toBe(newProduct.description);
      expect(data.id).toBeDefined();
      expect(data.createdAt).toBeDefined();
    });

    it("should trim name and description", async () => {
      const newProduct = {
        name: "  Test Product  ",
        description: "  Test description  ",
      };

      const request = new Request("http://localhost/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe("Test Product");
      expect(data.description).toBe("Test description");
    });

    it("should return 400 if required fields are missing", async () => {
      const request = new Request("http://localhost/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should return 400 for invalid JSON", async () => {
      const request = new Request("http://localhost/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid request body");
    });
  });
});

