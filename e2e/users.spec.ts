import { test, expect } from "@playwright/test";
import { navigateToUsers, navigateToNewUser, navigateToUserDetail } from "./helpers/navigation";
import { fillUserForm, submitForm } from "./helpers/forms";
import { generateTestUser } from "./fixtures/test-data";

test.describe("Users E2E", () => {
  test("should navigate to users list from home", async ({ page }) => {
    await page.goto("/");
    await page.click('text=Users');
    await expect(page).toHaveURL("/users");
    await expect(page.locator("h1, h2").filter({ hasText: /user/i })).toBeVisible();
  });

  test("should display users list", async ({ page }) => {
    await navigateToUsers(page);
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    const hasUsers = await page.locator('a[href^="/users/"]').count() > 0;
    const hasEmptyState = await page.locator('text=No users found').isVisible();
    expect(hasUsers || hasEmptyState).toBeTruthy();
  });

  test("should navigate to create user page", async ({ page }) => {
    await navigateToUsers(page);
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    await page.click('text=+ Create User');
    await expect(page).toHaveURL("/users/new");
    await expect(page.locator("h1")).toContainText("Create New User");
  });

  test("should create a new user", async ({ page }) => {
    await navigateToNewUser(page);
    
    const testUser = generateTestUser();
    await fillUserForm(page, {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
    });

    await submitForm(page);
    
    // Should redirect to users list
    await expect(page).toHaveURL("/users");
    // Should see the new user - use a more specific locator to avoid matching multiple elements
    await expect(page.locator(`a:has-text("${testUser.firstName} ${testUser.lastName}")`)).toBeVisible();
  });

  test("should validate required fields when creating user", async ({ page }) => {
    await navigateToNewUser(page);
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    // Fill only first name
    await page.fill('input[id="firstName"]', "Test");
    await expect(submitButton).toBeDisabled();
  });

  test("should validate email format", async ({ page }) => {
    await navigateToNewUser(page);
    
    const testUser = generateTestUser();
    await fillUserForm(page, {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: "invalid-email", // Invalid email format
    });

    // Try to submit - browser validation should prevent it
    const emailInput = page.locator('input[id="email"]');
    await expect(emailInput).toHaveAttribute("type", "email");
    
    // HTML5 validation should prevent submission
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBeFalsy();
  });

  test("should view user details", async ({ page }) => {
    await navigateToUsers(page);
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    
    const firstUserLink = page.locator('a[href^="/users/"]').first();
    if (await firstUserLink.count() > 0) {
      const userHref = await firstUserLink.getAttribute("href");
      await firstUserLink.click();
      
      await expect(page).toHaveURL(userHref || "");
      await expect(page.locator("h1, h2")).toBeVisible();
    }
  });

  test("should edit a user", async ({ page }) => {
    // First create a user to edit
    await navigateToNewUser(page);
    
    const testUser = generateTestUser();
    await fillUserForm(page, {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
    });
    await submitForm(page);
    await page.waitForURL("/users");
    
    // Now edit the user we just created
    const userLink = page.locator('a[href^="/users/"]').filter({ hasText: testUser.firstName });
    const userHref = await userLink.getAttribute("href");
    const userId = userHref?.replace("/users/", "").split("/")[0] || "";
    expect(userId).toBeTruthy();
    
    await userLink.click();
    // Wait for navigation to user detail page
    await page.waitForURL(`/users/${userId}`, { timeout: 10000 });
    
    // Wait for user detail to load - wait for h1 to appear (user name)
    await page.waitForSelector('h1', { state: "visible", timeout: 10000 });
    // Wait for Edit link to be visible - use href attribute
    await page.waitForSelector('a[href*="/edit"]', { state: "visible", timeout: 10000 });
    await page.click('a[href*="/edit"]');
    
    await expect(page).toHaveURL(`/users/${userId}/edit`);
    
    const newFirstName = `Updated${Date.now()}`;
    await fillUserForm(page, {
      firstName: newFirstName,
      lastName: "UpdatedLastName",
      email: `updated${Date.now()}@example.com`,
    });
    
    await submitForm(page);
    
    await expect(page).toHaveURL(`/users/${userId}`);
    await expect(page.locator("h1, h2")).toContainText(newFirstName);
  });

  test("should delete a user", async ({ page }) => {
    // Create a user to delete
    await navigateToNewUser(page);
    
    const testUser = generateTestUser();
    await fillUserForm(page, {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
    });
    await submitForm(page);
    
    await page.waitForURL("/users");
    // Use a more specific locator to avoid matching multiple elements
    const userLink = page.locator('a[href^="/users/"]').filter({ hasText: testUser.firstName });
    await userLink.click();
    
    // Wait for user detail to load
    await Promise.race([
      page.waitForSelector('text=Loading user...', { state: "hidden" }).catch(() => {}),
      page.waitForSelector('h1').catch(() => {}),
    ]);
    // Wait for the page Delete button (not in modal) to be visible
    await page.waitForSelector('button:has-text("Delete"):not([disabled])', { state: "visible" });
    
    const userId = page.url().split("/users/")[1];
    
    // Click the page Delete button to open the modal
    await page.click('button:has-text("Delete"):not([disabled])');
    // Wait for the modal to appear
    await expect(page.locator('text=Delete User')).toBeVisible();
    // Click the Delete button inside the modal
    await page.click('div[class*="fixed"] button:has-text("Delete"):not([disabled])');
    
    await expect(page).toHaveURL("/users");
    await expect(page.locator(`text=${testUser.firstName}`)).not.toBeVisible();
  });

  test("should navigate back from user detail", async ({ page }) => {
    await navigateToUsers(page);
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    
    const firstUserLink = page.locator('a[href^="/users/"]').first();
    if (await firstUserLink.count() > 0) {
      await firstUserLink.click();
      await page.click('text=← Back to Users');
      await expect(page).toHaveURL("/users");
    }
  });
});

