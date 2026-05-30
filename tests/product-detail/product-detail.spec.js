const { test, expect } = require('../../fixtures/pageFixture');

test.describe('Module 10 – Product Detail & Interaction', () => {

  // All tests in this module navigate to product id=4 (Sauce Labs Backpack)
  // which is a stable, always-present product on SauceDemo.
  test.beforeEach(async ({ productDetailPage }) => {
    await productDetailPage.navigate(4);
  });

  // ── Page Load & Content ────────────────────────────────────────────────────

  test('TC_PDT_01 - product detail page loads at correct URL', async ({ page }) => {
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('TC_PDT_02 - product detail page shows a non-empty product name', async ({ productDetailPage }) => {
    await expect(productDetailPage.productName).toBeVisible();
    const name = await productDetailPage.getProductName();
    expect(name).not.toBe('');
  });

  test('TC_PDT_03 - product detail page shows a non-empty product description', async ({ productDetailPage }) => {
    await expect(productDetailPage.productDesc).toBeVisible();
    const desc = (await productDetailPage.productDesc.innerText()).trim();
    expect(desc).not.toBe('');
  });

  test('TC_PDT_04 - product detail page shows price in $X.XX format', async ({ productDetailPage }) => {
    await expect(productDetailPage.productPrice).toBeVisible();
    const price = await productDetailPage.getProductPrice();
    expect(price).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('TC_PDT_05 - product detail page shows product image', async ({ productDetailPage }) => {
    await expect(productDetailPage.productImage).toBeVisible();
  });

  // ── Add to Cart Button ─────────────────────────────────────────────────────

  test('TC_PDT_06 - Add to Cart button is visible on detail page', async ({ productDetailPage }) => {
    await expect(productDetailPage.addToCartButton).toBeVisible();
  });

  test('TC_PDT_07 - clicking Add to Cart updates cart badge to 1', async ({ productDetailPage }) => {
    await productDetailPage.addToCart();
    await expect(productDetailPage.cartBadge).toHaveText('1');
  });

  test('TC_PDT_08 - Add to Cart button changes to Remove after clicking', async ({ productDetailPage }) => {
    await productDetailPage.addToCart();
    // Add button should disappear and Remove button should appear
    await expect(productDetailPage.addToCartButton).not.toBeVisible();
    await expect(productDetailPage.removeButton).toBeVisible();
  });

  // ── Remove Button ──────────────────────────────────────────────────────────

  test('TC_PDT_09 - clicking Remove clears the cart badge', async ({ productDetailPage }) => {
    await productDetailPage.addToCart();
    await productDetailPage.removeFromCart();
    await expect(productDetailPage.cartBadge).not.toBeVisible();
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  test('TC_PDT_10 - Back to Products button is visible', async ({ productDetailPage }) => {
    await expect(productDetailPage.backButton).toBeVisible();
  });

  test('TC_PDT_11 - Back to Products button navigates to inventory page', async ({ productDetailPage, page }) => {
    await productDetailPage.goBack();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_PDT_12 - item added from detail page appears in the cart', async ({ productDetailPage, cartPage }) => {
    await productDetailPage.addToCart();
    await cartPage.navigate();
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('TC_PDT_13 - cart icon on detail page navigates to cart', async ({ productDetailPage, page }) => {
    await productDetailPage.cartIcon.click();
    await expect(page).toHaveURL(/cart\.html/);
  });

  // ── Cross-Page Consistency ─────────────────────────────────────────────────

  test('TC_PDT_14 - name on detail page matches the product name clicked in catalog', async ({ productDetailPage, page }) => {
    // Go to catalog and record the name of the first product
    await page.goto('/inventory.html');
    const nameInCatalog = await page.locator('.inventory_item_name').first().innerText();

    // Click that product to go to its detail page
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);

    // The name on the detail page must match what was shown in the catalog
    const nameOnDetail = await productDetailPage.getProductName();
    expect(nameOnDetail).toBe(nameInCatalog.trim());
  });

  // ── Full Flow ──────────────────────────────────────────────────────────────

  test('TC_PDT_15 - add from detail page → cart → proceed to checkout step 1', async ({ productDetailPage, cartPage, page }) => {
    await productDetailPage.addToCart();
    await cartPage.navigate();
    expect(await cartPage.getItemCount()).toBe(1);
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

});
