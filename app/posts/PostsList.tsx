"use client";

import { usePosts } from "./usePosts";

export function PostsList() {
  const { data, isLoading, error } = usePosts();

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
      <div className="text-zinc-600 dark:text-zinc-400">No posts found.</div>
    );
  }

  return (
    <div className="space-y-4">
      {data.posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
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
        </div>
      ))}
    </div>
  );
}

