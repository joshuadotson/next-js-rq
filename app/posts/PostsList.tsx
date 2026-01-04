"use client";

import Link from "next/link";
import { usePosts } from "./_hooks/usePosts";

export function PostsList() {
  const { data, isLoading, error, refetch, isRefetching } = usePosts();

  if (isLoading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading posts...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error: {error.message}
      </div>
    );
  }

  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            No posts found.
          </span>
          <div className="flex gap-2">
            <Link
              href="/posts/new"
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              + Create Post
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
          {data.posts.length} post{data.posts.length !== 1 ? "s" : ""}
        </span>
        <div className="flex gap-2">
          <Link
            href="/posts/new"
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            + Create Post
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
      {data.posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="block bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            {post.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
            {post.content}
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500 flex-wrap">
            <span>By {post.author}</span>
            <span>❤️ {post.likes}</span>
            <span>👁️ {post.views}</span>
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

