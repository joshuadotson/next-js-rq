import { NextResponse } from "next/server";
import { mockPosts } from "@/lib/mock-data/posts";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}

