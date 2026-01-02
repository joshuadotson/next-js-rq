import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchPosts } from "./prefetch";
import { PostsList } from "./PostsList";

export default async function PostsPage() {
  // Prefetch on the server
  const dehydratedState = await prefetchPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Posts
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Server state hooks are colocated with the route in{" "}
          <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">
            app/posts/
          </code>
          . Data is prefetched on the server and hydrated on the client with no
          duplication.
        </p>
        <HydrationBoundary state={dehydratedState}>
          <PostsList />
        </HydrationBoundary>
      </div>
    </div>
  );
}

