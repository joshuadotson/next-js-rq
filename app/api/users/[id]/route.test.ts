import { describe, it, expect } from "vitest";
import { GET, PUT, DELETE } from "@/app/api/users/[id]/route";
import { mockUsers } from "@/lib/mock-data/users";

describe("GET /api/users/[id]", () => {
  describe("GET", () => {
    it("should return a user by id", async () => {
      const userId = mockUsers[0].id;
      const params = Promise.resolve({ id: userId });
      const request = new Request(`http://localhost/api/users/${userId}`);

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(userId);
    });

    it("should return 404 for non-existent user", async () => {
      const params = Promise.resolve({ id: "user-999" });
      const request = new Request("http://localhost/api/users/user-999");

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });
  });

  describe("PUT", () => {
    it("should update a user", async () => {
      const userId = mockUsers[0].id;
      const params = Promise.resolve({ id: userId });
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
        email: "updated@example.com",
      };

      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.firstName).toBe(updateData.firstName);
      expect(data.lastName).toBe(updateData.lastName);
      expect(data.email).toBe(updateData.email);
    });

    it("should return 404 for non-existent user", async () => {
      const params = Promise.resolve({ id: "user-999" });
      const request = new Request("http://localhost/api/users/user-999", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return 400 if required fields are missing", async () => {
      const userId = mockUsers[0].id;
      const params = Promise.resolve({ id: userId });
      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Test" }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should return 400 for invalid email format", async () => {
      const userId = mockUsers[0].id;
      const params = Promise.resolve({ id: userId });
      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: "invalid-email",
        }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid email format");
    });

    it("should return 400 if email already exists for another user", async () => {
      const userId = mockUsers[0].id;
      const existingEmail = mockUsers[1].email;
      const params = Promise.resolve({ id: userId });
      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: existingEmail,
        }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email already exists");
    });
  });

  describe("DELETE", () => {
    it("should delete a user", async () => {
      const userId = mockUsers[0].id;
      const params = Promise.resolve({ id: userId });
      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 404 for non-existent user", async () => {
      const params = Promise.resolve({ id: "user-999" });
      const request = new Request("http://localhost/api/users/user-999", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });
  });
});

