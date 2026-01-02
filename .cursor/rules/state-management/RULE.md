---
description: "Strict rules for organizing server state and UI/component state with mandatory separation"
alwaysApply: true
---

# State Management Organization Rules

## Core Principle
**Server state** and **UI/component state** MUST be strictly separated. They serve different purposes and require different patterns.

---

## Directory Structure

### Server State
- **Location**: `features/[feature-name]/use[Feature].ts` (feature-based organization)
- **Purpose**: Data fetched from APIs, cached data, server-side data synchronization
- **Examples**: `features/users/useUser.ts`, `features/posts/usePosts.ts`, `features/products/useProduct.ts`
- **Pattern**: Each feature has its own directory with server state hooks
- **Allowed patterns**: React Query, SWR, server actions, API route handlers

### UI/Component State
- **Location**: `hooks/ui-state/` or `hooks/component-state/`
- **Purpose**: Local component state, form state, UI toggles, temporary UI state
- **Examples**: Modal open/close, form inputs, dropdown states, loading spinners, UI preferences
- **Allowed patterns**: `useState`, `useReducer`, form libraries (React Hook Form, etc.)

---

## Strict Rules

### 1. Server State Rules
- ✅ **MUST** be organized by feature: `features/[feature-name]/use[Feature].ts`
- ✅ **MUST** use data fetching libraries (React Query, SWR, etc.) or server actions
- ✅ **MUST** be prefixed with `use` (e.g., `useUser`, `usePosts`, `useProduct`)
- ✅ **MUST** handle loading, error, and success states
- ✅ **MUST** be cacheable and shareable across components
- ✅ **MUST** be placed in feature directories (e.g., `features/users/useUser.ts`)
- ❌ **NEVER** use `useState` for server-fetched data
- ❌ **NEVER** mix server state with UI state in the same hook
- ❌ **NEVER** place server state hooks in component files
- ❌ **NEVER** use flat directories like `lib/server-state/` or `hooks/server-state/`

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
- ✅ **MUST** import server state from feature directories: `features/[feature-name]/use[Feature]`
- ✅ **MUST** import UI state from `hooks/ui-state/` or `hooks/component-state/`
- ✅ **MUST** use absolute imports or clear relative paths
- ✅ **MUST** import from feature-based paths (e.g., `from '@/features/users/useUser'`)
- ❌ **NEVER** import server state from UI state directories
- ❌ **NEVER** import UI state from server state directories
- ❌ **NEVER** import server state from flat directories like `lib/server-state/`

### 5. Component Usage Rules
- ✅ **MUST** clearly separate server state hooks from UI state hooks in components
- ✅ **MUST** group server state hooks together, then UI state hooks
- ✅ **MUST** use server state for data that needs to be shared/cached
- ✅ **MUST** use UI state for component-specific, ephemeral state
- ❌ **NEVER** derive server state from UI state (fetch data based on UI state is OK, but don't store server data in UI state)
- ❌ **NEVER** store server-fetched data in `useState`

---

## Naming Conventions

### Server State
- **Directory**: `features/[feature-name]/` (kebab-case for feature names)
- **Hooks**: `use[Feature]` (PascalCase, matches feature name)
- **Files**: `use[Feature].ts` (matches hook name)
- **Examples**: 
  - `features/users/useUser.ts` exports `useUser`
  - `features/posts/usePosts.ts` exports `usePosts`
  - `features/product-catalog/useProductCatalog.ts` exports `useProductCatalog`
- **Multiple hooks per feature**: If a feature needs multiple hooks, use descriptive names:
  - `features/users/useUser.ts` (single user)
  - `features/users/useUsers.ts` (list of users)
  - `features/users/useUserMutation.ts` (mutations)

### UI/Component State
- Hooks: `use[Feature]State`, `use[Feature]`, `use[Component]State`
- Files: `use-[feature]-state.ts`, `use-[component].ts`
- Examples: `useModalState.ts`, `useFormState.ts`, `useDropdown.ts`

---

## Examples

### ✅ CORRECT: Server State (Feature-Based)
```typescript
// features/users/useUser.ts
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

// features/posts/usePosts.ts
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });
}

// features/products/useProduct.ts
export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  });
}
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

