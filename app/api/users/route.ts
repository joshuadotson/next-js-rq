import { NextResponse } from "next/server";
import { mockUsers, type User } from "@/lib/mock-data/users";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  // Apply pagination
  const offsetNum = offset ? parseInt(offset, 10) : 0;
  const limitNum = limit ? parseInt(limit, 10) : mockUsers.length;
  const paginatedUsers = mockUsers.slice(offsetNum, offsetNum + limitNum);

  return NextResponse.json({
    users: paginatedUsers,
    total: mockUsers.length,
    limit: limitNum,
    offset: offsetNum,
  });
}

export async function POST(request: Request) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (mockUsers.some((user) => user.email === email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Generate new user ID (increment from highest existing ID)
    const maxId = Math.max(
      ...mockUsers.map((user) => {
        const num = parseInt(user.id.replace("user-", ""), 10);
        return isNaN(num) ? 0 : num;
      }),
      0
    );
    const newId = `user-${maxId + 1}`;

    // Create new user
    const newUser: User = {
      id: newId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    // Add to mockUsers array (in-memory, won't persist across server restarts)
    mockUsers.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

