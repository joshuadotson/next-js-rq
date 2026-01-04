import { NextResponse } from "next/server";
import { mockUsers, type User } from "@/lib/mock-data/users";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const userIndex = mockUsers.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

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

    // Check if email already exists (excluding current user)
    const existingUserWithEmail = mockUsers.find(
      (user) => user.email === email && user.id !== id
    );
    if (existingUserWithEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const existingUser = mockUsers[userIndex];

    const updatedUser: User = {
      ...existingUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    mockUsers[userIndex] = updatedUser;

    return NextResponse.json(updatedUser);
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
  const userIndex = mockUsers.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  mockUsers.splice(userIndex, 1);

  return NextResponse.json({ success: true }, { status: 200 });
}

