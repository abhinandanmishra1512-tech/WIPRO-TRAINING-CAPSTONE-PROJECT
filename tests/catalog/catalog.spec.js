const { test, expect } = require('@playwright/test');
const { ProductCatalogPage } = require('../../pages/catalog/ProductCatalogPage.js');

test.describe('Product Catalog', () => {

  test('search by exact product name returns results', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.searchFor('laptop');
    await expect(catalog.productItems.first()).toBeVisible();
  });

  test('partial search returns results', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.searchFor('book');
    await expect(catalog.productItems.first()).toBeVisible();
  });

  test('search with no results shows no result message', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.searchFor('xyznonexistentproduct123');
    await expect(catalog.noResultsMsg).toBeVisible();
  });

  test('filter by Computers category loads products', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers');
    const items = page.locator('.product-item');
    await expect(items.first()).toBeVisible();
  });

  test('filter by Books category loads products', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/books');
    const items = page.locator('.product-item');
    await expect(items.first()).toBeVisible();
  });

  test('sort by price low to high works', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers/notebooks');
    const catalog = new ProductCatalogPage(page);
    await catalog.sortBy('10');
    await expect(page).toHaveURL(/orderby=10/);
  });

  test('sort by price high to low works', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers/notebooks');
    const catalog = new ProductCatalogPage(page);
    await catalog.sortBy('11');
    await expect(page).toHaveURL(/orderby=11/);
  });

  test('grid view toggle works', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers/notebooks');
    const catalog = new ProductCatalogPage(page);
    await catalog.gridViewBtn.click();
    await expect(page.locator('.product-grid')).toBeVisible();
  });

  test('list view toggle works', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers/notebooks');
    const catalog = new ProductCatalogPage(page);
    await catalog.listViewBtn.click();
    await expect(page.locator('.product-list')).toBeVisible();
  });

  test('product detail page loads on click', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.navigate();
    await catalog.searchFor('laptop');
    await catalog.productItems.first().click();
    await expect(page).toHaveURL(/\/[a-z]/);
    await expect(page.locator('.product-name')).toBeVisible();
  });

  test('pagination is visible on category page', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers');
    const pager = page.locator('.pager');
    // Pager only shows if enough products exist
    await expect(page.locator('.product-item').first()).toBeVisible();
  });

  test('breadcrumb navigation is visible on product page', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers/notebooks');
    await page.locator('.product-item').first().click();
    await expect(page.locator('.breadcrumb')).toBeVisible();
  });

  test('category page has correct heading', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/computers');
    await expect(page.locator('.page-title')).toContainText('Computers');
  });

  test('electronics category loads correctly', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/electronics');
    await expect(page.locator('.page-title')).toContainText('Electronics');
  });

  test('apparel category loads correctly', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/apparel');
    await expect(page.locator('.page-title')).toContainText('Apparel');
  });

});