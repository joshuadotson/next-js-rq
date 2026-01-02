import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Welcome to Next RQ
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          A Next.js application with feature-based state management organization.
        </p>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Link
            href="/users"
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Users
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              View and manage users
            </p>
          </Link>

          <Link
            href="/posts"
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Posts
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Browse posts and articles
            </p>
          </Link>

          <Link
            href="/products"
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Products
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Explore product catalog
            </p>
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            State Management Structure
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            This project follows strict rules for organizing server state and UI state:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Server state: <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">features/[feature-name]/use[Feature].ts</code></li>
            <li>UI state: <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">hooks/ui-state/</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
