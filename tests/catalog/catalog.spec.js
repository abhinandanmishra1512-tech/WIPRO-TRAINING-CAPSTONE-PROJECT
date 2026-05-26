const { test, expect } = require('@playwright/test');
const { ProductCatalogPage } = require('../../pages/catalog/ProductCatalogPage.js');

// These tests require auth (uses storageState from playwright.config.js)
test.describe('Product Catalog - SauceDemo', () => {

  test('inventory page loads with products', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await expect(catalog.productItems.first()).toBeVisible();
  });

  test('inventory page shows 6 products by default', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    const count = await catalog.getProductCount();
    expect(count).toBe(6);
  });

  test('inventory page has correct title', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await expect(catalog.pageTitle).toHaveText('Products');
  });

  test('sort by Name (Z to A) reorders list', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.sortBy('za');
    const sortValue = await catalog.sortDropdown.inputValue();
    expect(sortValue).toBe('za');
  });

  test('sort by Price (low to high) works', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.sortBy('lohi');
    const sortValue = await catalog.sortDropdown.inputValue();
    expect(sortValue).toBe('lohi');
  });

  test('sort by Price (high to low) works', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.sortBy('hilo');
    const sortValue = await catalog.sortDropdown.inputValue();
    expect(sortValue).toBe('hilo');
  });

  test('sort by Name (A to Z) works', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.sortBy('az');
    const sortValue = await catalog.sortDropdown.inputValue();
    expect(sortValue).toBe('az');
  });

  test('each product has a name', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    const count = await catalog.productItems.count();
    for (let i = 0; i < count; i++) {
      const name = await catalog.productNames.nth(i).innerText();
      expect(name.trim().length).toBeGreaterThan(0);
    }
  });

  test('each product has a price', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    const prices = page.locator('.inventory_item_price');
    const count = await prices.count();
    for (let i = 0; i < count; i++) {
      const price = await prices.nth(i).innerText();
      expect(price).toMatch(/\$\d+\.\d{2}/);
    }
  });

  test('each product has an image', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    const images = page.locator('.inventory_item img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking product opens detail page', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.clickFirstProduct();
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('product detail page shows product name', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.clickFirstProduct();
    await expect(page.locator('.inventory_details_name')).toBeVisible();
  });

  test('product detail page shows price', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.clickFirstProduct();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
  });

  test('product detail page has Add to cart button', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.clickFirstProduct();
    await expect(page.locator('[data-test^="add-to-cart"]')).toBeVisible();
  });

  test('back to products button works on detail page', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.clickFirstProduct();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

});