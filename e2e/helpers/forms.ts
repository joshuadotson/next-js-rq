import { Page } from "@playwright/test";

/**
 * Form interaction helpers for E2E tests
 */

export async function fillPostForm(
  page: Page,
  data: { title: string; content: string; authorId: string }
) {
  await page.fill('input[id="title"]', data.title);
  await page.fill('textarea[id="content"]', data.content);
  await page.selectOption('select[id="authorId"]', data.authorId);
}

export async function fillProductForm(
  page: Page,
  data: { name: string; description: string }
) {
  await page.fill('input[id="name"]', data.name);
  await page.fill('textarea[id="description"]', data.description);
}

export async function fillUserForm(
  page: Page,
  data: { firstName: string; lastName: string; email: string }
) {
  await page.fill('input[id="firstName"]', data.firstName);
  await page.fill('input[id="lastName"]', data.lastName);
  await page.fill('input[id="email"]', data.email);
}

export async function submitForm(page: Page) {
  await page.click('button[type="submit"]');
}

export async function waitForFormSubmission(page: Page) {
  // Wait for navigation or form submission
  await page.waitForLoadState("networkidle");
}

