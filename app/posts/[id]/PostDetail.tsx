"use client";

import Link from "next/link";
import { usePost } from "../usePost";

export function PostDetail({ id }: { id: string }) {
  const { data: post, isLoading, error } = usePost(id);

  if (isLoading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading post...</div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-600 dark:text-red-400">
          Error: {error.message}
        </div>
        <Link
          href="/posts"
          className="inline-block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          ← Back to Posts
        </Link>
      </div>
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
    <div className="space-y-6">
      <Link
        href="/posts"
        className="inline-block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
      >
        ← Back to Posts
      </Link>

      <article className="bg-white dark:bg-zinc-900 rounded-lg p-8 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500 mb-6 flex-wrap">
          <span>By {post.author}</span>
          <span>❤️ {post.likes}</span>
          <span>👁️ {post.views}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </article>
    </div>
  );
}

