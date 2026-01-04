import type { Post } from "@/lib/mock-data/posts";

export type PostsResponse = {
  posts: Post[];
  total: number;
  limit: number;
  offset: number;
};

export type PostsParams = {
  limit?: number;
  offset?: number;
  authorId?: string;
  tag?: string;
};

export async function fetchPosts(
  params?: PostsParams,
  baseUrl?: string
): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());
  if (params?.authorId) searchParams.set("authorId", params.authorId);
  if (params?.tag) searchParams.set("tag", params.tag);

  const url = baseUrl
    ? `${baseUrl}/api/posts?${searchParams.toString()}`
    : `/api/posts?${searchParams.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

export async function fetchPost(id: string, baseUrl?: string): Promise<Post> {
  const url = baseUrl ? `${baseUrl}/api/posts/${id}` : `/api/posts/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
}

export type CreatePostData = {
  title: string;
  content: string;
  author: string;
};

export async function createPost(
  data: CreatePostData,
  baseUrl?: string
): Promise<Post> {
  const url = baseUrl ? `${baseUrl}/api/posts` : `/api/posts`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to create post" }));
    throw new Error(error.error || "Failed to create post");
  }

  return response.json();
}

