"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUpdatePost } from "../../_hooks/useUpdatePost";
import { usePost } from "../../_hooks/usePost";
import { useUsers } from "@/app/users/_hooks/useUsers";

export function EditPostForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: post, isLoading: isLoadingPost } = usePost(id);
  const { mutate, isPending, error } = useUpdatePost(id);
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();
  // Initialize form state with post data when available
  // Using key prop on form to reset when post changes, avoiding setState in useEffect
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [authorId, setAuthorId] = useState(post?.authorId ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !authorId) {
      return;
    }

    mutate(
      { title: title.trim(), content: content.trim(), authorId },
      {
        onSuccess: () => {
          // Redirect to post detail page after successful update
          router.push(`/posts/${id}`);
        },
      }
    );
  };

  if (isLoadingPost) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading post...</div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-4">
        <div className="text-zinc-600 dark:text-zinc-400">Post not found.</div>
        <Link
          href="/posts"
          className="inline-block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          ← Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <form key={post.id} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isPending}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter post title"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isPending}
          rows={10}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="Enter post content"
        />
      </div>

      <div>
        <label
          htmlFor="authorId"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Author
        </label>
        <select
          id="authorId"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          required
          disabled={isPending || isLoadingUsers}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select an author</option>
          {usersData?.users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>
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
          disabled={isPending || !title.trim() || !content.trim() || !authorId || isLoadingUsers}
          className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating..." : "Update Post"}
        </button>
        <Link
          href={`/posts/${id}`}
          className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

