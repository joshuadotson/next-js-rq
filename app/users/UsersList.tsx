"use client";

import Link from "next/link";
import { useUsers } from "./useUsers";

export function UsersList() {
  const { data, isLoading, error, refetch, isRefetching } = useUsers();

  if (isLoading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading users...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error: {error.message}
      </div>
    );
  }

  if (!data?.users || data.users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            No users found.
          </span>
          <div className="flex gap-2">
            <Link
              href="/users/new"
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              + Create User
            </Link>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefetching ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {data.users.length} user{data.users.length !== 1 ? "s" : ""}
        </span>
        <div className="flex gap-2">
          <Link
            href="/users/new"
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            + Create User
          </Link>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefetching ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </div>
      {data.users.map((user) => (
        <Link
          key={user.id}
          href={`/users/${user.id}`}
          className="block bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {user.email}
          </p>
        </Link>
      ))}
    </div>
  );
}

