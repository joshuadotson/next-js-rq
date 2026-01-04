import { NextResponse } from "next/server";
import { mockPosts, type Post } from "@/lib/mock-data/posts";
import { mockUsers } from "@/lib/mock-data/users";

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

export async function POST(request: Request) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

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

    // Generate new post ID (increment from highest existing ID)
    const maxId = Math.max(
      ...mockPosts.map((post) => parseInt(post.id, 10)),
      0
    );
    const newId = (maxId + 1).toString();

    // Create new post with current timestamp
    const now = new Date().toISOString();
    const newPost: Post = {
      id: newId,
      title,
      content,
      author,
      authorId,
      createdAt: now,
      updatedAt: now,
      tags: [],
      likes: 0,
      views: 0,
    };

    // Add to mockPosts array (in-memory, won't persist across server restarts)
    mockPosts.unshift(newPost); // Add to beginning of array

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

