import { NextResponse } from "next/server";
import { mockPosts, type Post } from "@/lib/mock-data/posts";
import { mockUsers } from "@/lib/mock-data/users";

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const postIndex = mockPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { title, content, authorId } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, authorId" },
        { status: 400 }
      );
    }

    // Validate that authorId exists in mockUsers
    const user = mockUsers.find((u) => u.id === authorId);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid authorId: user not found" },
        { status: 400 }
      );
    }

    // Derive author name from user data
    const author = `${user.firstName} ${user.lastName}`;

    const existingPost = mockPosts[postIndex];
    const now = new Date().toISOString();

    const updatedPost: Post = {
      ...existingPost,
      title,
      content,
      author,
      authorId,
      updatedAt: now,
    };

    mockPosts[postIndex] = updatedPost;

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const postIndex = mockPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  mockPosts.splice(postIndex, 1);

  return NextResponse.json({ success: true }, { status: 200 });
}

