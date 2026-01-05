import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/users/route";
import { mockUsers } from "@/lib/mock-data/users";

describe("GET /api/users", () => {
  describe("GET", () => {
    it("should return all users with pagination", async () => {
      const request = new Request("http://localhost/api/users");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toBeDefined();
      expect(data.total).toBe(mockUsers.length);
      expect(data.users.length).toBeGreaterThan(0);
    });

    it("should paginate users with limit and offset", async () => {
      const request = new Request("http://localhost/api/users?limit=2&offset=0");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toHaveLength(2);
      expect(data.limit).toBe(2);
      expect(data.offset).toBe(0);
    });
  });

  describe("POST", () => {
    it("should create a new user", async () => {
      const newUser = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@example.com",
      };

      const request = new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.firstName).toBe(newUser.firstName);
      expect(data.lastName).toBe(newUser.lastName);
      expect(data.email).toBe(newUser.email);
      expect(data.id).toBeDefined();
    });

    it("should trim firstName, lastName, and email", async () => {
      const newUser = {
        firstName: "  Test  ",
        lastName: "  User  ",
        email: `trim.test.${Date.now()}@example.com`, // Use unique email to avoid conflicts
      };

      const request = new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.firstName).toBe("Test");
      expect(data.lastName).toBe("User");
      expect(data.email).toBe(newUser.email.trim());
    });

    it("should return 400 if required fields are missing", async () => {
      const request = new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should return 400 for invalid email format", async () => {
      const request = new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: "invalid-email",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid email format");
    });

    it("should return 400 if email already exists", async () => {
      const existingEmail = mockUsers[0].email;
      const request = new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: existingEmail,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email already exists");
    });
  });
});

