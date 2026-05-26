const { test, expect } = require('@playwright/test');
const { CartPage } = require('../../pages/cart/CartPage.js');

// These tests require auth (uses storageState from playwright.config.js)
// Each test gets a fresh isolated browser context — cart is empty by default
test.describe('Shopping Cart - SauceDemo', () => {

  test('cart is empty by default', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    const count = await cart.getItemCount();
    expect(count).toBe(0);
  });

  test('cart page loads successfully', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('cart page has correct title', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.cartTitle).toHaveText('Your Cart');
  });

  test('cart badge not visible when cart is empty', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('add product to cart from inventory', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('cart badge updates after adding product', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    await page.locator('[data-test^="add-to-cart"]').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('added product appears in cart', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    const cart = new CartPage(page);
    await cart.navigate();
    const count = await cart.getItemCount();
    expect(count).toBe(1);
  });

  test('remove item from cart works', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    const cart = new CartPage(page);
    await cart.navigate();
    await cart.removeFirstItem();
    const count = await cart.getItemCount();
    expect(count).toBe(0);
  });

  test('checkout button is visible with items in cart', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.checkoutButton).toBeVisible();
  });

  test('continue shopping button returns to inventory', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await cart.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('cart item shows product name', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(page.locator('.inventory_item_name').first()).toBeVisible();
  });

  test('cart item shows product price', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(page.locator('.inventory_item_price').first()).toBeVisible();
  });

  test('checkout navigates to checkout step one', async ({ page }) => {
    await page.goto('/inventory.html');
    await page.locator('[data-test^="add-to-cart"]').first().click();
    const cart = new CartPage(page);
    await cart.navigate();
    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('cart icon is visible in header', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
  });

});