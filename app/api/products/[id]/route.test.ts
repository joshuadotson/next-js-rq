import { describe, it, expect } from "vitest";
import { GET, PUT, DELETE } from "@/app/api/products/[id]/route";
import { mockProducts } from "@/lib/mock-data/products";

describe("GET /api/products/[id]", () => {
  describe("GET", () => {
    it("should return a product by id", async () => {
      const productId = mockProducts[0].id;
      const params = Promise.resolve({ id: productId });
      const request = new Request(`http://localhost/api/products/${productId}`);

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(productId);
    });

    it("should return 404 for non-existent product", async () => {
      const params = Promise.resolve({ id: "999" });
      const request = new Request("http://localhost/api/products/999");

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Product not found");
    });
  });

  describe("PUT", () => {
    it("should update a product", async () => {
      const productId = mockProducts[0].id;
      const params = Promise.resolve({ id: productId });
      const updateData = {
        name: "Updated Product",
        description: "Updated description",
      };

      const request = new Request(`http://localhost/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe(updateData.name);
      expect(data.description).toBe(updateData.description);
    });

    it("should return 404 for non-existent product", async () => {
      const params = Promise.resolve({ id: "999" });
      const request = new Request("http://localhost/api/products/999", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test",
          description: "Test",
        }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Product not found");
    });

    it("should return 400 if required fields are missing", async () => {
      const productId = mockProducts[0].id;
      const params = Promise.resolve({ id: productId });
      const request = new Request(`http://localhost/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test" }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });
  });

  describe("DELETE", () => {
    it("should delete a product", async () => {
      const productId = mockProducts[0].id;
      const params = Promise.resolve({ id: productId });
      const request = new Request(`http://localhost/api/products/${productId}`, {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 404 for non-existent product", async () => {
      const params = Promise.resolve({ id: "999" });
      const request = new Request("http://localhost/api/products/999", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Product not found");
    });
  });
});

