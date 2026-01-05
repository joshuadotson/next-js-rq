import { describe, it, expect } from "vitest";
import {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  type UsersParams,
} from "@/app/users/fetch";
import { server } from "@/__tests__/setup";
import { http, HttpResponse } from "msw";

describe("fetchUsers", () => {
  it("should fetch all users", async () => {
    const result = await fetchUsers();

    expect(result.users).toBeDefined();
    expect(result.total).toBeDefined();
    expect(Array.isArray(result.users)).toBe(true);
  });

  it("should handle pagination params", async () => {
    const params: UsersParams = { limit: 2, offset: 0 };
    const result = await fetchUsers(params);

    expect(result.users.length).toBeLessThanOrEqual(2);
    expect(result.limit).toBe(2);
    expect(result.offset).toBe(0);
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json({ error: "Server error" }, { status: 500 });
      })
    );

    await expect(fetchUsers()).rejects.toThrow("Failed to fetch users");
  });
});

describe("fetchUser", () => {
  it("should fetch a single user by id", async () => {
    const result = await fetchUser("user-1");

    expect(result.id).toBe("user-1");
    expect(result.firstName).toBeDefined();
    expect(result.lastName).toBeDefined();
    expect(result.email).toBeDefined();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.get("/api/users/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(fetchUser("user-999")).rejects.toThrow("Failed to fetch user");
  });
});

describe("createUser", () => {
  it("should create a new user", async () => {
    const newUser = {
      firstName: "Test",
      lastName: "User",
      email: "test.user@example.com",
    };

    const result = await createUser(newUser);

    expect(result.firstName).toBe(newUser.firstName);
    expect(result.lastName).toBe(newUser.lastName);
    expect(result.email).toBe(newUser.email);
    expect(result.id).toBeDefined();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.post("/api/users", () => {
        return HttpResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      })
    );

    await expect(
      createUser({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      })
    ).rejects.toThrow();
  });
});

describe("updateUser", () => {
  it("should update an existing user", async () => {
    const updateData = {
      firstName: "Updated",
      lastName: "Name",
      email: "updated@example.com",
    };

    const result = await updateUser("user-1", updateData);

    expect(result.firstName).toBe(updateData.firstName);
    expect(result.lastName).toBe(updateData.lastName);
    expect(result.email).toBe(updateData.email);
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.put("/api/users/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(
      updateUser("user-999", {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      })
    ).rejects.toThrow();
  });
});

describe("deleteUser", () => {
  it("should delete a user", async () => {
    await expect(deleteUser("user-1")).resolves.not.toThrow();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.delete("/api/users/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(deleteUser("user-999")).rejects.toThrow();
  });
});

