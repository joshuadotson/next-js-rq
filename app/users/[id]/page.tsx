import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchUser } from "../prefetch";
import { UserDetail } from "./UserDetail";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Prefetch on the server
  const dehydratedState = await prefetchUser(id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HydrationBoundary state={dehydratedState}>
          <UserDetail id={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
}

