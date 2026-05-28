const { test, expect } = require('../../fixtures/pageFixture');

test.describe('Module 02 – Product Catalog', () => {
  const getNames = async (catalogPage) => catalogPage.productNames.allInnerTexts();
  const getPrices = async (page) => (await page.locator('.inventory_item_price').allInnerTexts())
    .map(price => Number(price.replace('$', '')));

  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.navigate();
  });

  test('inventory page loads with products', async ({ catalogPage }) => {
    await expect(catalogPage.productItems.first()).toBeVisible();
  });

  test('inventory page shows 6 products by default', async ({ catalogPage }) => {
    expect(await catalogPage.getProductCount()).toBe(6);
  });

  test('inventory page has correct title', async ({ catalogPage }) => {
    await expect(catalogPage.pageTitle).toHaveText('Products');
  });

  test('sort by Name (Z to A) applies correctly', async ({ catalogPage }) => {
    await catalogPage.sortBy('za');
    const names = await getNames(catalogPage);
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort by Price (low to high) applies correctly', async ({ catalogPage, page }) => {
    await catalogPage.sortBy('lohi');
    const prices = await getPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by Price (high to low) applies correctly', async ({ catalogPage, page }) => {
    await catalogPage.sortBy('hilo');
    const prices = await getPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sort by Name (A to Z) applies correctly', async ({ catalogPage }) => {
    await catalogPage.sortBy('az');
    const names = await getNames(catalogPage);
    expect(names).toEqual([...names].sort());
  });

  test('each product has a non-empty name', async ({ catalogPage }) => {
    const count = await catalogPage.productItems.count();
    for (let i = 0; i < count; i++) {
      const name = await catalogPage.productNames.nth(i).innerText();
      expect(name.trim()).not.toBe('');
    }
  });

  test('each product shows a price in $X.XX format', async ({ page }) => {
    const prices = await page.locator('.inventory_item_price').allInnerTexts();
    prices.forEach(p => expect(p).toMatch(/^\$\d+\.\d{2}$/));
  });

  test('each product has an image', async ({ page }) => {
    await expect(page.locator('.inventory_item img')).toHaveCount(6);
  });

  test('clicking a product opens its detail page', async ({ catalogPage, page }) => {
    await catalogPage.clickFirstProduct();
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('product detail page shows name', async ({ catalogPage, page }) => {
    await catalogPage.clickFirstProduct();
    await expect(page.locator('.inventory_details_name')).toBeVisible();
  });

  test('product detail page shows price', async ({ catalogPage, page }) => {
    await catalogPage.clickFirstProduct();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
  });

  test('product detail page has Add to Cart button', async ({ catalogPage, page }) => {
    await catalogPage.clickFirstProduct();
    await expect(page.locator('[data-test^="add-to-cart"]')).toBeVisible();
  });

  test('Back to Products button returns to inventory', async ({ catalogPage, page }) => {
    await catalogPage.clickFirstProduct();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

});
