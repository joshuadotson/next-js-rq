"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUpdateUser } from "../../useUpdateUser";
import { useUser } from "../../useUser";

export function EditUserForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useUser(id);
  const { mutate, isPending, error } = useUpdateUser(id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Pre-populate form when user data is loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return;
    }

    mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      },
      {
        onSuccess: () => {
          // Redirect to user detail page after successful update
          router.push(`/users/${id}`);
        },
      }
    );
  };

  if (isLoadingUser) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading user...</div>
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={isPending}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter first name"
        />
      </div>

      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          disabled={isPending}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter last name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter email address"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error.message}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending || !firstName.trim() || !lastName.trim() || !email.trim()}
          className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating..." : "Update User"}
        </button>
        <Link
          href={`/users/${id}`}
          className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

