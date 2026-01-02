import { getQueryClient } from "@/lib/react-query/query-client";
import { dehydrate } from "@tanstack/react-query";
import type { Post } from "@/lib/mock-data/posts";

type PostsResponse = {
  posts: Post[];
  total: number;
  limit: number;
  offset: number;
};

export async function prefetchPosts(params?: {
  limit?: number;
  offset?: number;
  authorId?: string;
  tag?: string;
}) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await queryClient.prefetchQuery({
    queryKey: ["posts", params],
    queryFn: async (): Promise<PostsResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.offset) searchParams.set("offset", params.offset.toString());
      if (params?.authorId) searchParams.set("authorId", params.authorId);
      if (params?.tag) searchParams.set("tag", params.tag);

      const response = await fetch(
        `${baseUrl}/api/posts?${searchParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json();
    },
  });

  return dehydrate(queryClient);
}

export async function prefetchPost(id: string) {
  const queryClient = getQueryClient();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await queryClient.prefetchQuery({
    queryKey: ["post", id],
    queryFn: async (): Promise<Post> => {
      const response = await fetch(`${baseUrl}/api/posts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      return response.json();
    },
  });

  return dehydrate(queryClient);
}

