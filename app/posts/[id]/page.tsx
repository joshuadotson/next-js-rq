import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchPost } from "../prefetch";
import { PostDetail } from "./PostDetail";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Prefetch on the server
  const dehydratedState = await prefetchPost(id);

  // If prefetch failed (404), show not found
  // Note: In a real app, you'd check the response status
  // For now, we'll let the client component handle the error state

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HydrationBoundary state={dehydratedState}>
          <PostDetail id={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
}

