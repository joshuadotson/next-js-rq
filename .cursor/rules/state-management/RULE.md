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
- **Location**: `app/[route]/_hooks/` (all hooks in feature `_hooks` folder)
- **Purpose**: Data fetched from APIs, cached data, server-side data synchronization
- **Examples**: `app/posts/_hooks/usePosts.ts`, `app/users/_hooks/useUser.ts`, `app/products/_hooks/useProduct.ts`
- **Pattern**: All server state hooks for a feature are centralized in `app/[route]/_hooks/`
- **Prefetch Functions**: Server-side prefetch functions should be colocated: `app/[route]/prefetch.ts`
- **Grouping**: 
  - **All hooks** (queries and mutations) for a feature should be in `app/[route]/_hooks/`
  - This includes:
    - Query hooks: `usePosts`, `usePost`, `useUsers`, `useUser`, etc.
    - Mutation hooks: `useCreatePost`, `useUpdatePost`, `useDeletePost`, etc.
  - This pattern provides:
    - Single location for all feature hooks (easier to find and maintain)
    - Consistent organization across features
    - Better discoverability for developers
- **Allowed patterns**: React Query, SWR, server actions, API route handlers

### UI/Component State
- **Location**: `hooks/ui-state/` or `hooks/component-state/`
- **Purpose**: Local component state, form state, UI toggles, temporary UI state
- **Examples**: Modal open/close, form inputs, dropdown states, loading spinners, UI preferences
- **Allowed patterns**: `useState`, `useReducer`, form libraries (React Hook Form, etc.)

---

## Strict Rules

### 1. Server State Rules
- ✅ **MUST** be in feature `_hooks/` folder: `app/[route]/_hooks/use[Feature].ts`
- ✅ **MUST** use data fetching libraries (React Query, SWR, etc.) or server actions
- ✅ **MUST** be prefixed with `use` (e.g., `useUser`, `usePosts`, `useProduct`)
- ✅ **MUST** handle loading, error, and success states
- ✅ **MUST** be cacheable and shareable across components
- ✅ **MUST** place all hooks (queries and mutations) in `app/[route]/_hooks/`
- ✅ **MUST** colocate prefetch functions with route: `app/[route]/prefetch.ts`
- ✅ **SHOULD** group all feature hooks together for consistency and discoverability
- ❌ **NEVER** use `useState` for server-fetched data
- ❌ **NEVER** mix server state with UI state in the same hook
- ❌ **NEVER** place server state hooks in component files
- ❌ **NEVER** use flat directories like `lib/server-state/` or `hooks/server-state/`
- ❌ **NEVER** use separate `features/` directory - colocate with routes
- ❌ **NEVER** place prefetch functions in shared `lib/` directories - colocate with route
- ❌ **NEVER** scatter mutation hooks in route subdirectories - keep all hooks in `_hooks/`

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
- ✅ **MUST** group all feature hooks in `app/[route]/_hooks/` directory
- ❌ **NEVER** mix server and UI state in the same file
- ❌ **NEVER** create ambiguous names (e.g., `useData` - is it server or UI?)

### 4. Import Rules
- ✅ **MUST** import server state from feature `_hooks/` directory: `app/[route]/_hooks/use[Feature]`
- ✅ **MUST** import UI state from `hooks/ui-state/` or `hooks/component-state/`
- ✅ **MUST** use relative imports within the same route directory (e.g., `from '../_hooks/usePosts'`)
- ✅ **MUST** use absolute imports for cross-route imports (e.g., `from '@/app/posts/_hooks/usePosts'`)
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
- **Directory**: `app/[route]/_hooks/` (all hooks in feature `_hooks` folder)
- **Hooks**: `use[Feature]` (PascalCase, matches feature name)
- **Files**: `use[Feature].ts` (matches hook name)
- **Examples**: 
  - `app/posts/_hooks/usePosts.ts` exports `usePosts` (list query)
  - `app/posts/_hooks/usePost.ts` exports `usePost` (single item query)
  - `app/posts/_hooks/useCreatePost.ts` exports `useCreatePost` (create mutation)
  - `app/posts/_hooks/useUpdatePost.ts` exports `useUpdatePost` (update mutation)
  - `app/posts/_hooks/useDeletePost.ts` exports `useDeletePost` (delete mutation)
  - `app/users/_hooks/useUser.ts` exports `useUser`
  - `app/product-catalog/_hooks/useProductCatalog.ts` exports `useProductCatalog`
- **All hooks per route**: All hooks (queries and mutations) should be in `app/[route]/_hooks/`
  - Query hooks: `usePosts.ts`, `usePost.ts`
  - Mutation hooks: `useCreatePost.ts`, `useUpdatePost.ts`, `useDeletePost.ts`
- **Prefetch functions**: Always colocate with route
  - `app/posts/prefetch.ts` (contains `prefetchPosts`, `prefetchPost`, etc.)

### UI/Component State
- Hooks: `use[Feature]State`, `use[Feature]`, `use[Component]State`
- Files: `use-[feature]-state.ts`, `use-[component].ts`
- Examples: `useModalState.ts`, `useFormState.ts`, `useDropdown.ts`

---

## Examples

### ✅ CORRECT: Server State (All Hooks in Feature `_hooks/` Folder)
```typescript
// All hooks centralized in app/posts/_hooks/
// app/posts/_hooks/usePosts.ts (list query)
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });
}

// app/posts/_hooks/usePost.ts (single item query)
export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  });
}

// app/posts/_hooks/useCreatePost.ts (create mutation)
export function useCreatePost() {
  // ... mutation logic
}

// app/posts/_hooks/useUpdatePost.ts (update mutation)
export function useUpdatePost(id: string) {
  // ... mutation logic
}

// app/posts/_hooks/useDeletePost.ts (delete mutation)
export function useDeletePost() {
  // ... mutation logic
}

// Usage in components:
// app/posts/new/page.tsx
import { useCreatePost } from "../_hooks/useCreatePost";

// app/posts/[id]/edit/EditPostForm.tsx
import { useUpdatePost } from "../../_hooks/useUpdatePost";
import { usePost } from "../../_hooks/usePost";
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

### ❌ INCORRECT: Scattering Hooks
```typescript
// DON'T DO THIS - hooks scattered across route subdirectories
// app/posts/new/useCreatePost.ts ❌
// app/posts/[id]/edit/useUpdatePost.ts ❌
// app/posts/_hooks/useDeletePost.ts ❌

// DO THIS - all hooks in _hooks/
// app/posts/_hooks/useCreatePost.ts ✅
// app/posts/_hooks/useUpdatePost.ts ✅
// app/posts/_hooks/useDeletePost.ts ✅
```

---

## Enforcement
- Always check directory structure before creating state management code
- Always verify imports match the state type
- Always use appropriate patterns for each state type
- Always separate concerns - one hook, one responsibility
- Always place all feature hooks in `app/[route]/_hooks/` for consistency

