import type { User } from "@/lib/mock-data/users";

export type UsersResponse = {
  users: User[];
  total: number;
  limit: number;
  offset: number;
};

export type UsersParams = {
  limit?: number;
  offset?: number;
};

export async function fetchUsers(
  params?: UsersParams,
  baseUrl?: string
): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());

  const url = baseUrl
    ? `${baseUrl}/api/users?${searchParams.toString()}`
    : `/api/users?${searchParams.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function fetchUser(id: string, baseUrl?: string): Promise<User> {
  const url = baseUrl ? `${baseUrl}/api/users/${id}` : `/api/users/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
};

export async function createUser(
  data: CreateUserData,
  baseUrl?: string
): Promise<User> {
  const url = baseUrl ? `${baseUrl}/api/users` : `/api/users`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to create user" }));
    throw new Error(error.error || "Failed to create user");
  }

  return response.json();
}

export type UpdateUserData = {
  firstName: string;
  lastName: string;
  email: string;
};

export async function updateUser(
  id: string,
  data: UpdateUserData,
  baseUrl?: string
): Promise<User> {
  const url = baseUrl ? `${baseUrl}/api/users/${id}` : `/api/users/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to update user" }));
    throw new Error(error.error || "Failed to update user");
  }

  return response.json();
}

export async function deleteUser(
  id: string,
  baseUrl?: string
): Promise<void> {
  const url = baseUrl ? `${baseUrl}/api/users/${id}` : `/api/users/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to delete user" }));
    throw new Error(error.error || "Failed to delete user");
  }
}

