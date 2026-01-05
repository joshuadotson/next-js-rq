/**
 * Test data factories and helpers for E2E tests
 */

export function generateTestUser() {
  const timestamp = Date.now();
  return {
    firstName: `Test${timestamp}`,
    lastName: "User",
    email: `test${timestamp}@example.com`,
  };
}

export function generateTestPost() {
  const timestamp = Date.now();
  return {
    title: `Test Post ${timestamp}`,
    content: `This is test content for post created at ${new Date().toISOString()}`,
  };
}

export function generateTestProduct() {
  const timestamp = Date.now();
  return {
    name: `Test Product ${timestamp}`,
    description: `Test product description created at ${new Date().toISOString()}`,
  };
}

