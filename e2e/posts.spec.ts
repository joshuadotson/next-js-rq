import { test, expect } from "@playwright/test";
import { navigateToPosts, navigateToNewPost, navigateToPostDetail } from "./helpers/navigation";
import { fillPostForm, submitForm } from "./helpers/forms";
import { generateTestPost } from "./fixtures/test-data";

test.describe("Posts E2E", () => {
  test("should navigate to posts list from home", async ({ page }) => {
    await page.goto("/");
    await page.click('text=Posts');
    await expect(page).toHaveURL("/posts");
    await expect(page.locator("h1, h2").filter({ hasText: /post/i })).toBeVisible();
  });

  test("should display posts list", async ({ page }) => {
    await navigateToPosts(page);
    // Wait for posts to load
    await page.waitForSelector('text=Loading posts...', { state: "hidden" });
    // Should see at least one post or empty state
    const hasPosts = await page.locator('a[href^="/posts/"]').count() > 0;
    const hasEmptyState = await page.locator('text=No posts found').isVisible();
    expect(hasPosts || hasEmptyState).toBeTruthy();
  });

  test("should navigate to create post page", async ({ page }) => {
    await navigateToPosts(page);
    await page.waitForSelector('text=Loading posts...', { state: "hidden" });
    await page.click('text=+ Create Post');
    await expect(page).toHaveURL("/posts/new");
    await expect(page.locator("h1")).toContainText("Create New Post");
  });

  test("should create a new post", async ({ page }) => {
    // First, get a user ID for the author
    await page.goto("/users");
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    
    // Get first user's ID from the link
    const firstUserLink = page.locator('a[href^="/users/"]').first();
    let userHref = await firstUserLink.getAttribute("href");
    let userId = userHref?.replace("/users/", "") || "";
    
    expect(userId).toBeTruthy();

    // Navigate to create post
    await navigateToNewPost(page);
    
    // Wait for users to load in the select
    const authorSelect = page.locator('select[id="authorId"]');
    await authorSelect.waitFor({ state: "attached" });
    // Wait for the select to be enabled (users have loaded) and have options
    await page.waitForFunction(
      () => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select) return false;
        // Check if select is enabled and has more than just the empty option
        const hasOptions = select.options.length > 1;
        return !select.disabled && hasOptions;
      },
      { timeout: 20000 }
    );
    // Verify the userId option exists before trying to select
    const optionExists = await page.evaluate((userId) => {
      const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
      if (!select) return false;
      return Array.from(select.options).some(opt => opt.value === userId);
    }, userId);
    
    if (!optionExists) {
      // If option doesn't exist, get the first available user ID from the select
      const firstOptionValue = await page.evaluate(() => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select || select.options.length < 2) return null;
        // Skip the first option (empty) and get the first real option
        return select.options[1].value;
      });
      if (firstOptionValue) {
        userId = firstOptionValue;
      }
    }
    
    const testPost = generateTestPost();
    await fillPostForm(page, {
      title: testPost.title,
      content: testPost.content,
      authorId: userId,
    });

    await submitForm(page);
    
    // Should redirect to posts list
    await expect(page).toHaveURL("/posts");
    // Should see the new post
    await expect(page.locator(`text=${testPost.title}`)).toBeVisible();
  });

  test("should validate required fields when creating post", async ({ page }) => {
    await navigateToNewPost(page);
    
    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    // Fill only title
    await page.fill('input[id="title"]', "Test Title");
    await expect(submitButton).toBeDisabled();
  });

  test("should view post details", async ({ page }) => {
    await navigateToPosts(page);
    await page.waitForSelector('text=Loading posts...', { state: "hidden" });
    
    // Click on first post
    const firstPostLink = page.locator('a[href^="/posts/"]').first();
    if (await firstPostLink.count() > 0) {
      const postHref = await firstPostLink.getAttribute("href");
      await firstPostLink.click();
      
      await expect(page).toHaveURL(postHref || "");
      // Should see post title
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should edit a post", async ({ page }) => {
    // First create a post to edit
    await page.goto("/users");
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    const firstUserLink = page.locator('a[href^="/users/"]').first();
    let userHref = await firstUserLink.getAttribute("href");
    let userId = userHref?.replace("/users/", "") || "";
    
    // Create a post
    await navigateToNewPost(page);
    const authorSelect = page.locator('select[id="authorId"]');
    await authorSelect.waitFor({ state: "attached" });
    await page.waitForFunction(
      () => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select) return false;
        return !select.disabled && select.options.length > 1;
      },
      { timeout: 20000 }
    );
    const optionExists = await page.evaluate((userId) => {
      const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
      if (!select) return false;
      return Array.from(select.options).some(opt => opt.value === userId);
    }, userId);
    if (!optionExists) {
      const firstOptionValue = await page.evaluate(() => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select || select.options.length < 2) return null;
        return select.options[1].value;
      });
      if (firstOptionValue) userId = firstOptionValue;
    }
    
    const testPost = generateTestPost();
    await fillPostForm(page, {
      title: testPost.title,
      content: testPost.content,
      authorId: userId,
    });
    await submitForm(page);
    await page.waitForURL("/posts");
    
    // Now edit the post we just created
    // Extract postId from the link's href before clicking
    // Use a more specific locator that targets the link element
    const postLink = page.locator('a[href^="/posts/"]').filter({ hasText: testPost.title });
    const postHref = await postLink.getAttribute("href");
    const postId = postHref?.replace("/posts/", "").split("/")[0] || "";
    expect(postId).toBeTruthy();
    
    await postLink.click();
    // Wait for navigation to post detail page
    await page.waitForURL(`/posts/${postId}`, { timeout: 10000 });
    
    // Wait for post detail to load
    await page.waitForSelector('h1', { state: "visible", timeout: 10000 });
    // Wait for Edit link to be visible
    await page.waitForSelector('a[href*="/edit"]', { state: "visible", timeout: 10000 });
    await page.click('a[href*="/edit"]');
    
    // Wait for navigation to edit page
    await expect(page).toHaveURL(`/posts/${postId}/edit`);
    
    // Update the title
    const newTitle = `Updated ${Date.now()}`;
    await page.fill('input[id="title"]', newTitle);
    
    // Get author ID (should be pre-selected)
    const editAuthorSelect = page.locator('select[id="authorId"]');
    const authorId = await editAuthorSelect.inputValue();
    
    await fillPostForm(page, {
      title: newTitle,
      content: "Updated content",
      authorId: authorId,
    });
    
    await submitForm(page);
    
    // Should redirect to post detail
    await expect(page).toHaveURL(`/posts/${postId}`);
    await expect(page.locator("h1")).toContainText(newTitle);
  });

  test("should delete a post with confirmation", async ({ page }) => {
    // First create a post to delete
    await page.goto("/users");
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    const firstUserLink = page.locator('a[href^="/users/"]').first();
    const userHref = await firstUserLink.getAttribute("href");
    const userId = userHref?.replace("/users/", "") || "";
    
    await navigateToNewPost(page);
    // Wait for users to load in the select
    const authorSelect = page.locator('select[id="authorId"]');
    await authorSelect.waitFor({ state: "attached" });
    // Wait for the select to be enabled and have options
    await page.waitForFunction(
      () => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select) return false;
        return !select.disabled && select.options.length > 1;
      },
      { timeout: 20000 }
    );
    // Check if the userId option exists, if not use the first available option
    const optionExists = await page.evaluate((userId) => {
      const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
      if (!select) return false;
      return Array.from(select.options).some(opt => opt.value === userId);
    }, userId);
    
    let finalUserId = userId;
    if (!optionExists) {
      // If option doesn't exist, get the first available user ID from the select
      const firstOptionValue = await page.evaluate(() => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select || select.options.length < 2) return null;
        // Skip the first option (empty) and get the first real option
        return select.options[1].value;
      });
      if (firstOptionValue) {
        finalUserId = firstOptionValue;
      }
    }
    
    const testPost = generateTestPost();
    await fillPostForm(page, {
      title: testPost.title,
      content: testPost.content,
      authorId: finalUserId,
    });
    await submitForm(page);
    
    // Wait for redirect and find the new post
    await page.waitForURL("/posts");
    await page.waitForSelector(`text=${testPost.title}`, { state: "visible" });
    await page.locator(`text=${testPost.title}`).click();
    
    // Wait for post detail to load - wait for content or loading to disappear
    await Promise.race([
      page.waitForSelector('text=Loading post...', { state: "hidden" }).catch(() => {}),
      page.waitForSelector('h1').catch(() => {}),
    ]);
    // Wait for the page Delete button (not in modal) to be visible
    await page.waitForSelector('button:has-text("Delete"):not([disabled])', { state: "visible" });
    
    // Get post ID from URL
    const postId = page.url().split("/posts/")[1];
    
    // Click the page Delete button to open the modal
    await page.click('button:has-text("Delete"):not([disabled])');
    
    // Wait for the modal to appear
    await expect(page.locator('text=Delete Post')).toBeVisible();
    // Click the Delete button inside the modal (the one with red background)
    await page.click('div[class*="fixed"] button:has-text("Delete"):not([disabled])');
    
    // Should redirect to posts list
    await expect(page).toHaveURL("/posts");
    // Post should be removed
    await expect(page.locator(`text=${testPost.title}`)).not.toBeVisible();
  });

  test("should cancel delete confirmation", async ({ page }) => {
    // First create a post to test with
    await page.goto("/users");
    await page.waitForSelector('text=Loading users...', { state: "hidden" });
    const firstUserLink = page.locator('a[href^="/users/"]').first();
    let userHref = await firstUserLink.getAttribute("href");
    let userId = userHref?.replace("/users/", "") || "";
    
    await navigateToNewPost(page);
    const authorSelect = page.locator('select[id="authorId"]');
    await authorSelect.waitFor({ state: "attached" });
    await page.waitForFunction(
      () => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select) return false;
        return !select.disabled && select.options.length > 1;
      },
      { timeout: 20000 }
    );
    const optionExists = await page.evaluate((userId) => {
      const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
      if (!select) return false;
      return Array.from(select.options).some(opt => opt.value === userId);
    }, userId);
    if (!optionExists) {
      const firstOptionValue = await page.evaluate(() => {
        const select = document.querySelector('select[id="authorId"]') as HTMLSelectElement;
        if (!select || select.options.length < 2) return null;
        return select.options[1].value;
      });
      if (firstOptionValue) userId = firstOptionValue;
    }
    
    const testPost = generateTestPost();
    await fillPostForm(page, {
      title: testPost.title,
      content: testPost.content,
      authorId: userId,
    });
    await submitForm(page);
    await page.waitForURL("/posts");
    
    // Now test cancel delete
    const postLink = page.locator('a[href^="/posts/"]').filter({ hasText: testPost.title });
    await postLink.click();
    await page.waitForURL(/\/posts\/\d+/, { timeout: 10000 });
    
    // Wait for post detail to load
    await Promise.race([
      page.waitForSelector('text=Loading post...', { state: "hidden" }).catch(() => {}),
      page.waitForSelector('h1').catch(() => {}),
    ]);
    // Wait for the page Delete button (not in modal) to be visible
    await page.waitForSelector('button:has-text("Delete"):not([disabled])', { state: "visible" });
    
    // Click the page Delete button to open the modal
    await page.click('button:has-text("Delete"):not([disabled])');
    
    // Cancel deletion
    await expect(page.locator('text=Delete Post')).toBeVisible();
    await page.click('button:has-text("Cancel")');
    
    // Modal should close, still on detail page
    await expect(page.locator('text=Delete Post')).not.toBeVisible();
    await expect(page.url()).toContain("/posts/");
  });

  test("should navigate back from post detail", async ({ page }) => {
    await navigateToPosts(page);
    await page.waitForSelector('text=Loading posts...', { state: "hidden" });
    
    const firstPostLink = page.locator('a[href^="/posts/"]').first();
    if (await firstPostLink.count() > 0) {
      await firstPostLink.click();
      await page.click('text=← Back to Posts');
      await expect(page).toHaveURL("/posts");
    }
  });
});

