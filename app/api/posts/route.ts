import { NextResponse } from "next/server";
import { mockPosts } from "@/lib/mock-data/posts";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const authorId = searchParams.get("authorId");
  const tag = searchParams.get("tag");

  let filteredPosts = [...mockPosts];

  // Filter by author if provided
  if (authorId) {
    filteredPosts = filteredPosts.filter((post) => post.authorId === authorId);
  }

  // Filter by tag if provided
  if (tag) {
    filteredPosts = filteredPosts.filter((post) => post.tags.includes(tag));
  }

  // Apply pagination
  const offsetNum = offset ? parseInt(offset, 10) : 0;
  const limitNum = limit ? parseInt(limit, 10) : filteredPosts.length;
  const paginatedPosts = filteredPosts.slice(offsetNum, offsetNum + limitNum);

  return NextResponse.json({
    posts: paginatedPosts,
    total: filteredPosts.length,
    limit: limitNum,
    offset: offsetNum,
  });
}

