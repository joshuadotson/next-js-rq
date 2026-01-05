"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUpdateProduct } from "../../_hooks/useUpdateProduct";
import { useProduct } from "../../_hooks/useProduct";

export function EditProductForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useProduct(id);
  const { mutate, isPending, error } = useUpdateProduct(id);
  // Initialize form state with product data when available
  // Using key prop on form to reset when product changes, avoiding setState in useEffect
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      return;
    }

    mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          // Redirect to product detail page after successful update
          router.push(`/products/${id}`);
        },
      }
    );
  };

  if (isLoadingProduct) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading product...</div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <div className="text-zinc-600 dark:text-zinc-400">Product not found.</div>
        <Link
          href="/products"
          className="inline-block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <form key={product.id} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isPending}
          rows={10}
          className="w-full px-4 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          placeholder="Enter product description"
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
          disabled={isPending || !name.trim() || !description.trim()}
          className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating..." : "Update Product"}
        </button>
        <Link
          href={`/products/${id}`}
          className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

