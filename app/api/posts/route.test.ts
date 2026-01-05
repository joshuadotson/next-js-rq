import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/posts/route";
import { mockPosts } from "@/lib/mock-data/posts";
import { mockUsers } from "@/lib/mock-data/users";

describe("POST /api/posts", () => {
  describe("GET", () => {
    it("should return all posts with pagination", async () => {
      const request = new Request("http://localhost/api/posts");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts).toBeDefined();
      expect(data.total).toBe(mockPosts.length);
      expect(data.posts.length).toBeGreaterThan(0);
    });

    it("should paginate posts with limit and offset", async () => {
      const request = new Request("http://localhost/api/posts?limit=2&offset=0");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts).toHaveLength(2);
      expect(data.limit).toBe(2);
      expect(data.offset).toBe(0);
    });

    it("should filter posts by authorId", async () => {
      const authorId = "user-1";
      const request = new Request(`http://localhost/api/posts?authorId=${authorId}`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts.every((post: any) => post.authorId === authorId)).toBe(true);
    });

    it("should filter posts by tag", async () => {
      const tag = "nextjs";
      const request = new Request(`http://localhost/api/posts?tag=${tag}`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts.every((post: any) => post.tags.includes(tag))).toBe(true);
    });

    it("should enrich posts with author names", async () => {
      const request = new Request("http://localhost/api/posts");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      const firstPost = data.posts[0];
      expect(firstPost.author).toBeDefined();
      expect(typeof firstPost.author).toBe("string");
    });
  });

  describe("POST", () => {
    it("should create a new post", async () => {
      const newPost = {
        title: "Test Post",
        content: "Test content",
        authorId: "user-1",
      };

      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(newPost.title);
      expect(data.content).toBe(newPost.content);
      expect(data.authorId).toBe(newPost.authorId);
      expect(data.id).toBeDefined();
      expect(data.author).toBeDefined();
    });

    it("should return 400 if required fields are missing", async () => {
      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should return 400 if authorId is invalid", async () => {
      const request = new Request("http://localhost/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test",
          content: "Test content",
          authorId: "invalid-user",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid authorId");
    });

    it("should return 400 for invalid JSON", async () => {
      const request = new Request("http://localhost/api/posts", {
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

