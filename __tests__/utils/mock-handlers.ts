import { http, HttpResponse } from "msw";
import { mockPosts } from "@/lib/mock-data/posts";
import { mockProducts } from "@/lib/mock-data/products";
import { mockUsers } from "@/lib/mock-data/users";

// Helper to enrich post with author name
function enrichPostWithAuthor(post: typeof mockPosts[0] & { author?: string }) {
  const user = mockUsers.find((u) => u.id === post.authorId);
  const author = user ? `${user.firstName} ${user.lastName}` : "Unknown Author";
  return {
    ...post,
    author,
  };
}

export const handlers = [
  // Posts endpoints
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const offset = url.searchParams.get("offset");
    const authorId = url.searchParams.get("authorId");
    const tag = url.searchParams.get("tag");

    let filteredPosts = [...mockPosts];

    if (authorId) {
      filteredPosts = filteredPosts.filter((post) => post.authorId === authorId);
    }

    if (tag) {
      filteredPosts = filteredPosts.filter((post) => post.tags.includes(tag));
    }

    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const limitNum = limit ? parseInt(limit, 10) : filteredPosts.length;
    const paginatedPosts = filteredPosts.slice(offsetNum, offsetNum + limitNum);

    const enrichedPosts = paginatedPosts.map(enrichPostWithAuthor);

    return HttpResponse.json({
      posts: enrichedPosts,
      total: filteredPosts.length,
      limit: limitNum,
      offset: offsetNum,
    });
  }),

  http.get("/api/posts/:id", ({ params }) => {
    const { id } = params;
    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const enrichedPost = enrichPostWithAuthor(post);
    return HttpResponse.json(enrichedPost);
  }),

  http.post("/api/posts", async ({ request }) => {
    const body = await request.json() as any;
    const { title, content, authorId } = body;

    if (!title || !content || !authorId) {
      return HttpResponse.json(
        { error: "Missing required fields: title, content, authorId" },
        { status: 400 }
      );
    }

    const user = mockUsers.find((u) => u.id === authorId);
    if (!user) {
      return HttpResponse.json(
        { error: "Invalid authorId: user not found" },
        { status: 400 }
      );
    }

    const maxId = Math.max(
      ...mockPosts.map((post) => parseInt(post.id, 10)),
      0
    );
    const newId = (maxId + 1).toString();
    const now = new Date().toISOString();

    const newPost = {
      id: newId,
      title,
      content,
      authorId,
      createdAt: now,
      updatedAt: now,
      tags: [],
      likes: 0,
      views: 0,
    };

    const enrichedPost = enrichPostWithAuthor(newPost);
    return HttpResponse.json(enrichedPost, { status: 201 });
  }),

  http.put("/api/posts/:id", async ({ params, request }) => {
    const { id } = params;
    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json() as any;
    const { title, content, authorId } = body;

    if (!title || !content || !authorId) {
      return HttpResponse.json(
        { error: "Missing required fields: title, content, authorId" },
        { status: 400 }
      );
    }

    const user = mockUsers.find((u) => u.id === authorId);
    if (!user) {
      return HttpResponse.json(
        { error: "Invalid authorId: user not found" },
        { status: 400 }
      );
    }

    const updatedPost = {
      ...post,
      title,
      content,
      authorId,
      updatedAt: new Date().toISOString(),
    };

    const enrichedPost = enrichPostWithAuthor(updatedPost);
    return HttpResponse.json(enrichedPost);
  }),

  http.delete("/api/posts/:id", ({ params }) => {
    const { id } = params;
    const postIndex = mockPosts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Products endpoints
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const offset = url.searchParams.get("offset");

    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const limitNum = limit ? parseInt(limit, 10) : mockProducts.length;
    const paginatedProducts = mockProducts.slice(offsetNum, offsetNum + limitNum);

    return HttpResponse.json({
      products: paginatedProducts,
      total: mockProducts.length,
      limit: limitNum,
      offset: offsetNum,
    });
  }),

  http.get("/api/products/:id", ({ params }) => {
    const { id } = params;
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  http.post("/api/products", async ({ request }) => {
    const body = await request.json() as any;
    const { name, description } = body;

    if (!name || !description) {
      return HttpResponse.json(
        { error: "Missing required fields: name, description" },
        { status: 400 }
      );
    }

    const maxId = Math.max(
      ...mockProducts.map((product) => parseInt(product.id, 10)),
      0
    );
    const newId = (maxId + 1).toString();
    const now = new Date().toISOString();

    const newProduct = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      createdAt: now,
      updatedAt: now,
    };

    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.put("/api/products/:id", async ({ params, request }) => {
    const { id } = params;
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json() as any;
    const { name, description } = body;

    if (!name || !description) {
      return HttpResponse.json(
        { error: "Missing required fields: name, description" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updatedProduct = {
      ...product,
      name: name.trim(),
      description: description.trim(),
      updatedAt: now,
    };

    return HttpResponse.json(updatedProduct);
  }),

  http.delete("/api/products/:id", ({ params }) => {
    const { id } = params;
    const productIndex = mockProducts.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Users endpoints
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const offset = url.searchParams.get("offset");

    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const limitNum = limit ? parseInt(limit, 10) : mockUsers.length;
    const paginatedUsers = mockUsers.slice(offsetNum, offsetNum + limitNum);

    return HttpResponse.json({
      users: paginatedUsers,
      total: mockUsers.length,
      limit: limitNum,
      offset: offsetNum,
    });
  }),

  http.get("/api/users/:id", ({ params }) => {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json() as any;
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return HttpResponse.json(
        { error: "Missing required fields: firstName, lastName, email" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return HttpResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (mockUsers.some((user) => user.email === email)) {
      return HttpResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const maxId = Math.max(
      ...mockUsers.map((user) => {
        const num = parseInt(user.id.replace("user-", ""), 10);
        return isNaN(num) ? 0 : num;
      }),
      0
    );
    const newId = `user-${maxId + 1}`;

    const newUser = {
      id: newId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put("/api/users/:id", async ({ params, request }) => {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json() as any;
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return HttpResponse.json(
        { error: "Missing required fields: firstName, lastName, email" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return HttpResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const existingUserWithEmail = mockUsers.find(
      (user) => user.email === email && user.id !== id
    );
    if (existingUserWithEmail) {
      return HttpResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const updatedUser = {
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    return HttpResponse.json(updatedUser);
  }),

  http.delete("/api/users/:id", ({ params }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];

