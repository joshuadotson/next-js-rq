import { describe, it, expect } from "vitest";
import {
  fetchPosts,
  fetchPost,
  createPost,
  updatePost,
  deletePost,
  type PostsParams,
} from "@/app/posts/fetch";
import { server } from "@/__tests__/setup";
import { http, HttpResponse } from "msw";

describe("fetchPosts", () => {
  it("should fetch all posts", async () => {
    const result = await fetchPosts();

    expect(result.posts).toBeDefined();
    expect(result.total).toBeDefined();
    expect(Array.isArray(result.posts)).toBe(true);
  });

  it("should handle pagination params", async () => {
    const params: PostsParams = { limit: 2, offset: 0 };
    const result = await fetchPosts(params);

    expect(result.posts.length).toBeLessThanOrEqual(2);
    expect(result.limit).toBe(2);
    expect(result.offset).toBe(0);
  });

  it("should handle authorId filter", async () => {
    const params: PostsParams = { authorId: "user-1" };
    const result = await fetchPosts(params);

    expect(result.posts.every((post) => post.authorId === "user-1")).toBe(true);
  });

  it("should handle tag filter", async () => {
    const params: PostsParams = { tag: "nextjs" };
    const result = await fetchPosts(params);

    expect(result.posts.every((post) => post.tags.includes("nextjs"))).toBe(true);
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.get("/api/posts", () => {
        return HttpResponse.json({ error: "Server error" }, { status: 500 });
      })
    );

    await expect(fetchPosts()).rejects.toThrow("Failed to fetch posts");
  });
});

describe("fetchPost", () => {
  it("should fetch a single post by id", async () => {
    const result = await fetchPost("1");

    expect(result.id).toBe("1");
    expect(result.title).toBeDefined();
    expect(result.content).toBeDefined();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.get("/api/posts/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(fetchPost("999")).rejects.toThrow("Failed to fetch post");
  });
});

describe("createPost", () => {
  it("should create a new post", async () => {
    const newPost = {
      title: "Test Post",
      content: "Test content",
      authorId: "user-1",
    };

    const result = await createPost(newPost);

    expect(result.title).toBe(newPost.title);
    expect(result.content).toBe(newPost.content);
    expect(result.authorId).toBe(newPost.authorId);
    expect(result.id).toBeDefined();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.post("/api/posts", () => {
        return HttpResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      })
    );

    await expect(
      createPost({ title: "Test", content: "Test", authorId: "user-1" })
    ).rejects.toThrow();
  });
});

describe("updatePost", () => {
  it("should update an existing post", async () => {
    const updateData = {
      title: "Updated Title",
      content: "Updated content",
      authorId: "user-1",
    };

    const result = await updatePost("1", updateData);

    expect(result.title).toBe(updateData.title);
    expect(result.content).toBe(updateData.content);
    expect(result.authorId).toBe(updateData.authorId);
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.put("/api/posts/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(
      updatePost("999", {
        title: "Test",
        content: "Test",
        authorId: "user-1",
      })
    ).rejects.toThrow();
  });
});

describe("deletePost", () => {
  it("should delete a post", async () => {
    await expect(deletePost("1")).resolves.not.toThrow();
  });

  it("should throw error on failed request", async () => {
    server.use(
      http.delete("/api/posts/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    await expect(deletePost("999")).rejects.toThrow();
  });
});

