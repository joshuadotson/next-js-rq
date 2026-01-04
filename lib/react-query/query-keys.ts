/**
 * Utility functions for creating consistent React Query keys.
 * 
 * These functions ensure that query keys are normalized consistently
 * between server-side prefetching and client-side hooks, preventing
 * cache mismatches and duplicate requests.
 */

/**
 * Normalizes params by removing undefined values.
 * This ensures consistent query keys regardless of how params are passed.
 */
function normalizeParams<T extends Record<string, unknown>>(
  params?: T
): T | undefined {
  if (!params) return undefined;

  const normalized = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined)
  ) as T;

  // Return undefined if all values were filtered out
  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

/**
 * Creates a query key for a resource with optional params.
 * 
 * @param resourceName - The name of the resource (e.g., "posts", "products", "users")
 * @param params - Optional params object (undefined values are filtered out)
 * @returns A normalized query key array
 * 
 * @example
 * ```ts
 * createQueryKey("posts", { limit: 10, offset: 0 })
 * // => ["posts", { limit: 10, offset: 0 }]
 * 
 * createQueryKey("posts", { limit: 10, offset: 0, authorId: undefined })
 * // => ["posts", { limit: 10, offset: 0 }]
 * 
 * createQueryKey("posts")
 * // => ["posts"]
 * ```
 */
export function createQueryKey<T extends Record<string, unknown>>(
  resourceName: string,
  params?: T
): [string] | [string, T] {
  const normalizedParams = normalizeParams(params);
  return normalizedParams ? [resourceName, normalizedParams] : [resourceName];
}

