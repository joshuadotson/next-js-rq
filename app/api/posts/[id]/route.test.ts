import { describe, it, expect } from "vitest";
import { GET, PUT, DELETE } from "@/app/api/posts/[id]/route";
import { mockPosts } from "@/lib/mock-data/posts";
import { mockUsers } from "@/lib/mock-data/users";

describe("POST /api/posts/[id]", () => {
  describe("GET", () => {
    it("should return a post by id", async () => {
      const postId = mockPosts[0].id;
      const params = Promise.resolve({ id: postId });
      const request = new Request(`http://localhost/api/posts/${postId}`);

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(postId);
      expect(data.author).toBeDefined();
    });

    it("should return 404 for non-existent post", async () => {
      const params = Promise.resolve({ id: "999" });
      const request = new Request("http://localhost/api/posts/999");

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Post not found");
    });
  });

  describe("PUT", () => {
    it("should update a post", async () => {
      const postId = mockPosts[0].id;
      const params = Promise.resolve({ id: postId });
      const updateData = {
        title: "Updated Title",
        content: "Updated content",
        authorId: "user-1",
      };

      const request = new Request(`http://localhost/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(updateData.title);
      expect(data.content).toBe(updateData.content);
      expect(data.authorId).toBe(updateData.authorId);
    });

    it("should return 404 for non-existent post", async () => {
      const params = Promise.resolve({ id: "999" });
      const request = new Request("http://localhost/api/posts/999", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test",
          content: "Test",
          authorId: "user-1",
        }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Post not found");
    });

    it("should return 400 if required fields are missing", async () => {
      const postId = mockPosts[0].id;
      const params = Promise.resolve({ id: postId });
      const request = new Request(`http://localhost/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should return 400 if authorId is invalid", async () => {
      const postId = mockPosts[0].id;
      const params = Promise.resolve({ id: postId });
      const request = new Request(`http://localhost/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test",
          content: "Test",
          authorId: "invalid-user",
        }),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid authorId");
    });
  });

  describe("DELETE", () => {
    it("should delete a post", async () => {
      const postId = mockPosts[0].id;
      const params = Promise.resolve({ id: postId });
      const request = new Request(`http://localhost/api/posts/${postId}`, {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should return 404 for non-existent post", async () => {
      const params = Promise.resolve({ id: "999" });
      const request = new Request("http://localhost/api/posts/999", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Post not found");
    });
  });
});

