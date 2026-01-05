import { test, expect } from "@playwright/test";
import { navigateToProducts, navigateToNewProduct, navigateToProductDetail } from "./helpers/navigation";
import { fillProductForm, submitForm } from "./helpers/forms";
import { generateTestProduct } from "./fixtures/test-data";

test.describe("Products E2E", () => {
  test("should navigate to products list from home", async ({ page }) => {
    await page.goto("/");
    await page.click('text=Products');
    await expect(page).toHaveURL("/products");
    await expect(page.locator("h1, h2").filter({ hasText: /product/i })).toBeVisible();
  });

  test("should display products list", async ({ page }) => {
    await navigateToProducts(page);
    await page.waitForSelector('text=Loading products...', { state: "hidden" });
    const hasProducts = await page.locator('a[href^="/products/"]').count() > 0;
    const hasEmptyState = await page.locator('text=No products found').isVisible();
    expect(hasProducts || hasEmptyState).toBeTruthy();
  });

  test("should navigate to create product page", async ({ page }) => {
    await navigateToProducts(page);
    await page.waitForSelector('text=Loading products...', { state: "hidden" });
    await page.click('text=+ Create Product');
    await expect(page).toHaveURL("/products/new");
    await expect(page.locator("h1")).toContainText("Create New Product");
  });

  test("should create a new product", async ({ page }) => {
    await navigateToNewProduct(page);
    
    const testProduct = generateTestProduct();
    await fillProductForm(page, {
      name: testProduct.name,
      description: testProduct.description,
    });

    await submitForm(page);
    
    // Should redirect to products list
    await expect(page).toHaveURL("/products");
    // Should see the new product
    await expect(page.locator(`text=${testProduct.name}`)).toBeVisible();
  });

  test("should validate required fields when creating product", async ({ page }) => {
    await navigateToNewProduct(page);
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    // Fill only name
    await page.fill('input[id="name"]', "Test Product");
    await expect(submitButton).toBeDisabled();
  });

  test("should view product details", async ({ page }) => {
    await navigateToProducts(page);
    await page.waitForSelector('text=Loading products...', { state: "hidden" });
    
    const firstProductLink = page.locator('a[href^="/products/"]').first();
    if (await firstProductLink.count() > 0) {
      const productHref = await firstProductLink.getAttribute("href");
      await firstProductLink.click();
      
      await expect(page).toHaveURL(productHref || "");
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should edit a product", async ({ page }) => {
    // First create a product to edit
    await navigateToNewProduct(page);
    
    const testProduct = generateTestProduct();
    await fillProductForm(page, {
      name: testProduct.name,
      description: testProduct.description,
    });
    await submitForm(page);
    await page.waitForURL("/products");
    
    // Now edit the product we just created
    const productLink = page.locator('a[href^="/products/"]').filter({ hasText: testProduct.name });
    const productHref = await productLink.getAttribute("href");
    const productId = productHref?.replace("/products/", "").split("/")[0] || "";
    expect(productId).toBeTruthy();
    
    await productLink.click();
    // Wait for navigation to product detail page
    await page.waitForURL(`/products/${productId}`, { timeout: 10000 });
    
    // Wait for product to load - wait for h1
    await page.waitForSelector('h1', { state: "visible", timeout: 10000 });
    // Wait for Edit link to be visible - use href attribute
    await page.waitForSelector('a[href*="/edit"]', { state: "visible", timeout: 10000 });
    await page.click('a[href*="/edit"]');
      
      await expect(page).toHaveURL(`/products/${productId}/edit`);
      
      const newName = `Updated Product ${Date.now()}`;
      await fillProductForm(page, {
        name: newName,
        description: "Updated description",
      });
      
      await submitForm(page);
      
      await expect(page).toHaveURL(`/products/${productId}`);
      await expect(page.locator("h1")).toContainText(newName);
  });

  test("should delete a product", async ({ page }) => {
    // Create a product to delete
    await navigateToNewProduct(page);
    
    const testProduct = generateTestProduct();
    await fillProductForm(page, {
      name: testProduct.name,
      description: testProduct.description,
    });
    await submitForm(page);
    
    await page.waitForURL("/products");
    await page.waitForSelector(`text=${testProduct.name}`, { state: "visible" });
    await page.locator(`text=${testProduct.name}`).click();
    
    // Wait for product detail to load
    await Promise.race([
      page.waitForSelector('text=Loading product...', { state: "hidden" }).catch(() => {}),
      page.waitForSelector('h1').catch(() => {}),
    ]);
    // Wait for the page Delete button (not in modal) to be visible
    await page.waitForSelector('button:has-text("Delete"):not([disabled])', { state: "visible" });
    
    const productId = page.url().split("/products/")[1];
    
    // Click the page Delete button to open the modal
    await page.click('button:has-text("Delete"):not([disabled])');
    // Wait for the modal to appear
    await expect(page.locator('text=Delete Product')).toBeVisible();
    // Click the Delete button inside the modal
    await page.click('div[class*="fixed"] button:has-text("Delete"):not([disabled])');
    
    await expect(page).toHaveURL("/products");
    await expect(page.locator(`text=${testProduct.name}`)).not.toBeVisible();
  });

  test("should navigate back from product detail", async ({ page }) => {
    await navigateToProducts(page);
    await page.waitForSelector('text=Loading products...', { state: "hidden" });
    
    const firstProductLink = page.locator('a[href^="/products/"]').first();
    if (await firstProductLink.count() > 0) {
      await firstProductLink.click();
      await page.click('text=← Back to Products');
      await expect(page).toHaveURL("/products");
    }
  });
});

