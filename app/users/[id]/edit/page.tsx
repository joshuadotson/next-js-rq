import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchUser } from "../../prefetch";
import { EditUserForm } from "./EditUserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Prefetch on the server
  const dehydratedState = await prefetchUser(id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Edit User
        </h1>
        <HydrationBoundary state={dehydratedState}>
          <EditUserForm id={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
}

