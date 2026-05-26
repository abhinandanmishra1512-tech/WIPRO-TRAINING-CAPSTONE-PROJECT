const { test, expect } = require('@playwright/test');
const { CartPage } = require('../../pages/cart/CartPage.js');

test.use({ storageState: 'test-data/auth.json' });

test.describe('Shopping Cart', () => {

  test('empty cart shows empty message', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.emptyCartMessage).toBeVisible();
  });

  test('cart page loads successfully', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(page).toHaveURL(/cart/);
  });

  test('cart badge is visible in header', async ({ page }) => {
    await page.goto('/');
    const cart = new CartPage(page);
    await expect(cart.cartBadge).toBeVisible();
  });

  test('add product to cart from search', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search store').fill('laptop');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.product-item').first().click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.bar-notification')).toBeVisible();
  });

  test('cart updates after adding product', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search store').fill('laptop');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.product-item').first().click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.goto('/cart');
    const cart = new CartPage(page);
    const count = await cart.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('checkout button is visible with items in cart', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search store').fill('laptop');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.product-item').first().click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.goto('/cart');
    const cart = new CartPage(page);
    await expect(cart.checkoutButton).toBeVisible();
  });

  test('continue shopping returns to home', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await page.getByRole('link', { name: 'Continue shopping' }).click();
    await expect(page).toHaveURL('https://demo.nopcommerce.com/');
  });

  test('discount code input is visible', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.discountInput).toBeVisible();
  });

  test('invalid discount code shows error', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await cart.applyDiscount('INVALIDCODE123');
    await expect(page.locator('.message-failure')).toBeVisible();
  });

  test('cart page has correct title', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(page).toHaveTitle(/Shopping Cart/);
  });

  test('update cart button is visible', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.updateCartButton).toBeVisible();
  });

  test('estimate shipping section is visible', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(
      page.getByText('Estimate shipping')
    ).toBeVisible();
  });

  test('gift card input is visible', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(
      page.locator('#giftcardcouponcode')
    ).toBeVisible();
  });

  test('cart subtotal section is visible', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.subTotal).toBeVisible();
  });

  test('terms of service checkbox is visible', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(
      page.locator('#termsofservice')
    ).toBeVisible();
  });

  test('cart page has breadcrumb', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(
      page.locator('.breadcrumb')
    ).toBeVisible();
  });

});