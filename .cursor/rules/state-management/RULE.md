---
description: "Strict rules for organizing server state and UI/component state with mandatory separation"
alwaysApply: true
---

# State Management Organization Rules

## Core Principle
**Server state** and **UI/component state** MUST be strictly separated. They serve different purposes and require different patterns.

---

## Directory Structure

### Server State (Next.js App Router - Colocated with Routes)
- **Location**: `app/[route]/use[Feature].ts` (colocated with route)
- **Purpose**: Data fetched from APIs, cached data, server-side data synchronization
- **Examples**: `app/posts/usePosts.ts`, `app/users/useUser.ts`, `app/products/useProduct.ts`
- **Pattern**: Server state hooks are colocated with their route directory
- **Prefetch Functions**: Server-side prefetch functions should also be colocated: `app/[route]/prefetch.ts`
- **Grouping**: 
  - Use `_hooks/` at the **route root** (`app/[route]/_hooks/`) if there are more than 3 **shared hooks** (used across multiple pages in the route)
  - Use `_hooks/` at the **action/page level** (`app/[route]/[action]/_hooks/`) if a specific action has more than 3 hooks specific to that action
  - Otherwise, colocate hooks directly with their page for better discoverability
  - **Shared hooks** (used in multiple places within the route) should be in `app/[route]/_hooks/`
  - **Single-use hooks** (used only in one specific page) should be colocated with that page, unless that page has more than 3 hooks (then use `_hooks/` at that page level)
- **Allowed patterns**: React Query, SWR, server actions, API route handlers

### UI/Component State
- **Location**: `hooks/ui-state/` or `hooks/component-state/`
- **Purpose**: Local component state, form state, UI toggles, temporary UI state
- **Examples**: Modal open/close, form inputs, dropdown states, loading spinners, UI preferences
- **Allowed patterns**: `useState`, `useReducer`, form libraries (React Hook Form, etc.)

---

## Strict Rules

### 1. Server State Rules
- ✅ **MUST** be colocated with route: `app/[route]/use[Feature].ts`
- ✅ **MUST** use data fetching libraries (React Query, SWR, etc.) or server actions
- ✅ **MUST** be prefixed with `use` (e.g., `useUser`, `usePosts`, `useProduct`)
- ✅ **MUST** handle loading, error, and success states
- ✅ **MUST** be cacheable and shareable across components
- ✅ **MUST** be placed in route directories (e.g., `app/posts/usePosts.ts`)
- ✅ **MUST** colocate prefetch functions with hooks: `app/[route]/prefetch.ts`
- ✅ **MUST** use `_hooks/` at route root (`app/[route]/_hooks/`) if there are more than 3 shared hooks (used across multiple pages)
- ✅ **MUST** use `_hooks/` at action/page level (`app/[route]/[action]/_hooks/`) if a specific action has more than 3 hooks specific to that action
- ✅ **SHOULD** colocate single-use hooks directly with their page if that page has 3 or fewer hooks (e.g., `app/posts/new/useCreatePost.ts`)
- ✅ **SHOULD** keep shared hooks (used in multiple pages) in `app/[route]/_hooks/` for consistency
- ❌ **NEVER** use `useState` for server-fetched data
- ❌ **NEVER** mix server state with UI state in the same hook
- ❌ **NEVER** place server state hooks in component files
- ❌ **NEVER** use flat directories like `lib/server-state/` or `hooks/server-state/`
- ❌ **NEVER** use separate `features/` directory - colocate with routes
- ❌ **NEVER** place prefetch functions in shared `lib/` directories - colocate with route

### 2. UI/Component State Rules
- ✅ **MUST** be placed in `hooks/ui-state/` or `hooks/component-state/`
- ✅ **MUST** use `useState`, `useReducer`, or form libraries
- ✅ **MUST** be prefixed with `use` if it's a hook (e.g., `useModal`, `useFormState`)
- ✅ **MUST** be scoped to component lifecycle
- ❌ **NEVER** use data fetching libraries for UI state
- ❌ **NEVER** mix UI state with server state in the same hook
- ❌ **NEVER** place UI state hooks in `lib/server-state/`

### 3. File Organization Rules
- ✅ **MUST** create separate files for each hook/utility
- ✅ **MUST** use clear, descriptive names that indicate state type
- ✅ **MUST** export hooks with explicit names (no default exports for hooks)
- ✅ **MUST** group related hooks in subdirectories if needed
- ❌ **NEVER** mix server and UI state in the same file
- ❌ **NEVER** create ambiguous names (e.g., `useData` - is it server or UI?)

### 4. Import Rules
- ✅ **MUST** import server state from route directories: `app/[route]/use[Feature]` or relative imports within route
- ✅ **MUST** import UI state from `hooks/ui-state/` or `hooks/component-state/`
- ✅ **MUST** use relative imports within the same route directory (e.g., `from './usePosts'`)
- ✅ **MUST** use absolute imports for cross-route imports (e.g., `from '@/app/posts/usePosts'`)
- ❌ **NEVER** import server state from UI state directories
- ❌ **NEVER** import UI state from server state directories
- ❌ **NEVER** import server state from flat directories like `lib/server-state/` or `features/`

### 5. Component Usage Rules
- ✅ **MUST** clearly separate server state hooks from UI state hooks in components
- ✅ **MUST** group server state hooks together, then UI state hooks
- ✅ **MUST** use server state for data that needs to be shared/cached
- ✅ **MUST** use UI state for component-specific, ephemeral state
- ❌ **NEVER** derive server state from UI state (fetch data based on UI state is OK, but don't store server data in UI state)
- ❌ **NEVER** store server-fetched data in `useState`

---

## Naming Conventions

### Server State (Next.js App Router)
- **Directory**: `app/[route]/` (route directory, kebab-case)
- **Hooks**: `use[Feature]` (PascalCase, matches feature name)
- **Files**: `use[Feature].ts` (matches hook name)
- **Examples**: 
  - `app/posts/usePosts.ts` exports `usePosts`
  - `app/users/useUser.ts` exports `useUser`
  - `app/product-catalog/useProductCatalog.ts` exports `useProductCatalog`
- **Multiple hooks per route**: 
  - If 3 or fewer hooks total: place directly in route directory
    - `app/posts/usePosts.ts` (list)
    - `app/posts/usePost.ts` (single)
    - `app/posts/usePostMutation.ts` (mutation)
  - If more than 3 **shared hooks** (used across multiple pages): group in route root `_hooks/`
    - `app/posts/_hooks/usePosts.ts` (used in list page, could be used elsewhere)
    - `app/posts/_hooks/usePost.ts` (used in detail and edit pages)
    - `app/posts/_hooks/useDeletePost.ts` (used in detail page, could be used elsewhere)
  - **Single-use hooks** (used only in one specific page):
    - If that page has 3 or fewer hooks: colocate directly with the page
      - `app/posts/new/useCreatePost.ts` (only used in `/posts/new`, 1 hook total)
      - `app/posts/[id]/edit/useUpdatePost.ts` (only used in `/posts/[id]/edit`, 1 hook total)
    - If that page has more than 3 hooks: use `_hooks/` at that page level
      - `app/posts/[id]/edit/_hooks/useUpdatePost.ts`
      - `app/posts/[id]/edit/_hooks/usePostValidation.ts`
      - `app/posts/[id]/edit/_hooks/usePostHistory.ts`
      - `app/posts/[id]/edit/_hooks/usePostPermissions.ts`
- **Prefetch functions**: Always colocate with route
  - `app/posts/prefetch.ts` (contains `prefetchPosts`, `prefetchPost`, etc.)

### UI/Component State
- Hooks: `use[Feature]State`, `use[Feature]`, `use[Component]State`
- Files: `use-[feature]-state.ts`, `use-[component].ts`
- Examples: `useModalState.ts`, `useFormState.ts`, `useDropdown.ts`

---

## Examples

### ✅ CORRECT: Server State (Next.js App Router - Colocated)
```typescript
// app/posts/usePosts.ts (colocated with route)
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });
}

// app/posts/usePost.ts (colocated with route)
export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  });
}

// app/users/useUser.ts (colocated with route)
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

// Route-level _hooks/ for shared hooks (more than 3 shared hooks):
// app/posts/_hooks/usePosts.ts (used in multiple places)
// app/posts/_hooks/usePost.ts (used in detail and edit pages)
// app/posts/_hooks/useDeletePost.ts (used in detail page)

// Page-level colocation (3 or fewer hooks for that page):
// app/posts/new/useCreatePost.ts (only used in /posts/new, 1 hook)
// app/posts/[id]/edit/useUpdatePost.ts (only used in /posts/[id]/edit, 1 hook)

// Page-level _hooks/ (more than 3 hooks specific to that action):
// app/posts/[id]/edit/_hooks/useUpdatePost.ts
// app/posts/[id]/edit/_hooks/usePostValidation.ts
// app/posts/[id]/edit/_hooks/usePostHistory.ts
// app/posts/[id]/edit/_hooks/usePostPermissions.ts
```

### ✅ CORRECT: UI State
```typescript
// hooks/ui-state/use-modal-state.ts
export function useModalState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
}
```

### ❌ INCORRECT: Mixing State Types
```typescript
// DON'T DO THIS
export function useUser(userId: string) {
  const [user, setUser] = useState(null); // Server state in useState
  const [isLoading, setIsLoading] = useState(false); // UI state mixed with server state
  // ...
}
```

---

## Enforcement
- Always check directory structure before creating state management code
- Always verify imports match the state type
- Always use appropriate patterns for each state type
- Always separate concerns - one hook, one responsibility

