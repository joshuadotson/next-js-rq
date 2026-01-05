import { Page } from "@playwright/test";

/**
 * Navigation helpers for E2E tests
 */

export async function navigateToHome(page: Page) {
  await page.goto("/");
}

export async function navigateToPosts(page: Page) {
  await page.goto("/posts");
}

export async function navigateToPostDetail(page: Page, postId: string) {
  await page.goto(`/posts/${postId}`);
}

export async function navigateToNewPost(page: Page) {
  await page.goto("/posts/new");
}

export async function navigateToEditPost(page: Page, postId: string) {
  await page.goto(`/posts/${postId}/edit`);
}

export async function navigateToProducts(page: Page) {
  await page.goto("/products");
}

export async function navigateToProductDetail(page: Page, productId: string) {
  await page.goto(`/products/${productId}`);
}

export async function navigateToNewProduct(page: Page) {
  await page.goto("/products/new");
}

export async function navigateToEditProduct(page: Page, productId: string) {
  await page.goto(`/products/${productId}/edit`);
}

export async function navigateToUsers(page: Page) {
  await page.goto("/users");
}

export async function navigateToUserDetail(page: Page, userId: string) {
  await page.goto(`/users/${userId}`);
}

export async function navigateToNewUser(page: Page) {
  await page.goto("/users/new");
}

export async function navigateToEditUser(page: Page, userId: string) {
  await page.goto(`/users/${userId}/edit`);
}

