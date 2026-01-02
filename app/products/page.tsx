export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Products
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          This is the products page. Server state hooks for products will be organized
          in <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">features/products/</code>
        </p>
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Product Catalog
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Products will be displayed here using server state hooks.
          </p>
        </div>
      </div>
    </div>
  );
}

