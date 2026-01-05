# Testing Guide

This project uses a comprehensive testing strategy with both unit/integration tests and end-to-end (E2E) tests.

## Testing Stack

### Unit & Integration Tests
- **Vitest**: Fast test runner with excellent Next.js/TypeScript support
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking for fetch functions and hooks
- **jsdom**: DOM environment for React component tests

### End-to-End Tests
- **Playwright**: Modern E2E testing framework with multi-browser support

## Test Organization

### Colocated Tests (Unit/Integration)

Tests are colocated next to their source files for better discoverability:

```
app/
  posts/
    _hooks/
      usePosts.ts
      usePosts.test.tsx        ← Colocated
    PostsList.tsx
    PostsList.test.tsx         ← Colocated
    fetch.ts
    fetch.test.ts              ← Colocated
  api/
    posts/
      route.ts
      route.test.ts            ← Colocated
```

### E2E Tests (Separate Directory)

E2E tests are in a separate `e2e/` directory since they test user journeys across multiple pages:

```
e2e/
  posts.spec.ts          # Posts CRUD flows
  products.spec.ts       # Products CRUD flows
  users.spec.ts          # Users CRUD flows
  fixtures/
    test-data.ts         # Test data generators
  helpers/
    navigation.ts         # Navigation helpers
    forms.ts             # Form interaction helpers
```

## Setup

### Initial Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Install Playwright browsers** (required for E2E tests):
   ```bash
   npm run test:e2e:setup
   # or
   pnpm exec playwright install
   ```

## Running Tests

### Unit & Integration Tests (Vitest)

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Open Vitest UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run with Playwright UI (interactive)
npm run test:e2e:ui

# Run in debug mode (step through tests)
npm run test:e2e:debug

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## Test Coverage

### Unit & Integration Tests

- **API Routes**: All GET, POST, PUT, DELETE endpoints
- **Fetch Functions**: All data fetching functions with error handling
- **React Query Hooks**: Query hooks, mutation hooks with optimistic updates
- **Components**: List components, detail components, loading/error states
- **Utilities**: Query key generation, query client setup

### E2E Tests

- **Posts**: Full CRUD operations, navigation, form validation, delete confirmation
- **Products**: Full CRUD operations
- **Users**: Full CRUD, email validation, duplicate handling
- **Navigation**: Home page, resource links, back navigation

## Writing Tests

### Unit/Integration Test Example

```typescript
// app/posts/_hooks/usePosts.test.tsx
import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { usePosts } from "./usePosts";
import { createTestQueryClient } from "@/__tests__/utils/test-utils";

describe("usePosts", () => {
  it("should fetch posts successfully", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePosts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.posts).toBeDefined();
  });
});
```

### E2E Test Example

```typescript
// e2e/posts.spec.ts
import { test, expect } from "@playwright/test";
import { navigateToPosts, navigateToNewPost } from "./helpers/navigation";
import { fillPostForm, submitForm } from "./helpers/forms";
import { generateTestPost } from "./fixtures/test-data";

test("should create a new post", async ({ page }) => {
  // Get a user ID for the author
  await page.goto("/users");
  await page.waitForSelector('text=Loading users...', { state: "hidden" });
  const firstUserLink = page.locator('a[href^="/users/"]').first();
  const userHref = await firstUserLink.getAttribute("href");
  const userId = userHref?.replace("/users/", "") || "";

  // Navigate and create post
  await navigateToNewPost(page);
  await page.waitForSelector('select[id="authorId"] option:not([value=""])');
  
  const testPost = generateTestPost();
  await fillPostForm(page, {
    title: testPost.title,
    content: testPost.content,
    authorId: userId,
  });

  await submitForm(page);
  
  // Verify redirect and new post appears
  await expect(page).toHaveURL("/posts");
  await expect(page.locator(`text=${testPost.title}`)).toBeVisible();
});
```

## Test Utilities

### Shared Test Utilities (`__tests__/utils/`)

- **`test-utils.tsx`**: `renderWithProviders()`, `createTestQueryClient()`
- **`mock-handlers.ts`**: MSW handlers for all API endpoints
- **`setup.ts`**: Global test configuration and MSW server setup

### E2E Helpers (`e2e/helpers/`)

- **`navigation.ts`**: Navigation helper functions
- **`forms.ts`**: Form filling and interaction helpers
- **`fixtures/test-data.ts`**: Test data generators

## Configuration

### Vitest Configuration

See `vitest.config.mts` for:
- Test environment (jsdom)
- Path aliases
- Coverage settings
- Test file patterns

### Playwright Configuration

See `playwright.config.ts` for:
- Test directory
- Base URL
- Browser configuration
- Web server setup (auto-starts Next.js dev server)

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:

```bash
npm run test:coverage
```

Coverage excludes:
- Test files (`*.test.*`, `*.spec.*`)
- Build artifacts (`.next/`, `dist/`, `build/`)
- Test utilities (`__tests__/`)
- Mock data
- Configuration files

## Best Practices

### Unit/Integration Tests

1. **Colocate tests** with source files for better discoverability
2. **Use MSW** for API mocking to test fetch functions and hooks
3. **Test behavior, not implementation** - focus on what users see
4. **Use test utilities** from `__tests__/utils/test-utils.tsx` for consistent setup
5. **Test optimistic updates** for mutations

### E2E Tests

1. **Test user journeys**, not individual components
2. **Use helper functions** from `e2e/helpers/` for reusable actions
3. **Generate unique test data** using fixtures to avoid conflicts
4. **Wait for loading states** before assertions
5. **Clean up test data** when possible (though mock data resets on server restart)

## Troubleshooting

### Playwright Issues

**Browsers not installed:**
```bash
npm run test:e2e:setup
```

**Port already in use:**
- Make sure no other dev server is running on port 3000
- Or update `baseURL` in `playwright.config.ts`

**Tests timing out:**
- Increase timeout in `playwright.config.ts`
- Check that the dev server is starting correctly

### Vitest Issues

**Tests not found:**
- Check `vitest.config.mts` includes patterns
- Ensure test files match `*.test.*` or `*.spec.*` pattern

**MSW not working:**
- Verify `__tests__/setup.ts` is configured in `vitest.config.mts`
- Check that handlers are properly set up in `mock-handlers.ts`

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npm run test:e2e:setup

- name: Run unit tests
  run: npm test

- name: Run E2E tests
  run: npm run test:e2e
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)

