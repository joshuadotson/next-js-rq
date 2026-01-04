import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchProduct } from "../../prefetch";
import { EditProductForm } from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Prefetch on the server
  const dehydratedState = await prefetchProduct(id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Edit Product
        </h1>
        <HydrationBoundary state={dehydratedState}>
          <EditProductForm id={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
}

