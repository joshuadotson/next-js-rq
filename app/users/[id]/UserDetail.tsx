"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "../_hooks/useUser";
import { useDeleteUser } from "../_hooks/useDeleteUser";

export function UserDetail({ id }: { id: string }) {
  const { data: user, isLoading, error } = useUser(id);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading user...</div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-600 dark:text-red-400">
          Error: {error.message}
        </div>
        <Link
          href="/users"
          className="inline-block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="text-zinc-600 dark:text-zinc-400">User not found.</div>
        <Link
          href="/users"
          className="inline-block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteUser(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/users"
          className="inline-block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          ← Back to Users
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/users/${id}/edit`}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 max-w-md w-full">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Delete User
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Are you sure you want to delete "{user.firstName} {user.lastName}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <article className="bg-white dark:bg-zinc-900 rounded-lg p-8 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
          {user.firstName} {user.lastName}
        </h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              Email
            </label>
            <p className="text-lg text-zinc-900 dark:text-zinc-50">
              {user.email}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

