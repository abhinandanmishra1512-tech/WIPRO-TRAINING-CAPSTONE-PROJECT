const { test, expect } = require('../../fixtures/pageFixture');

test.describe('Module 03 – Shopping Cart', () => {

  test('cart is empty by default', async ({ cartPage }) => {
    await cartPage.navigate();
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('cart page loads at correct URL', async ({ cartPage, page }) => {
    await cartPage.navigate();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('cart page title is "Your Cart"', async ({ cartPage }) => {
    await cartPage.navigate();
    await expect(cartPage.cartTitle).toHaveText('Your Cart');
  });

  test('cart badge is hidden when cart is empty', async ({ catalogPage }) => {
    await catalogPage.navigate();
    await expect(catalogPage.page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('adding a product shows badge count of 1', async ({ catalogPage }) => {
    await catalogPage.navigate();
    await catalogPage.addFirstProductToCart();
    await expect(catalogPage.page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('adding two products shows badge count of 2', async ({ catalogPage }) => {
    await catalogPage.navigate();
    await catalogPage.addFirstProductToCart();
    await catalogPage.addFirstProductToCart();
    await expect(catalogPage.page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('added product appears in cart', async ({ cartPage }) => {
    await cartPage.addItemAndNavigate();
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('removing an item from cart works', async ({ cartPage }) => {
    await cartPage.addItemAndNavigate();
    await cartPage.removeFirstItem();
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('checkout button is visible with items in cart', async ({ cartPage }) => {
    await cartPage.addItemAndNavigate();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('Continue Shopping returns to inventory', async ({ cartPage, page }) => {
    await cartPage.navigate();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('cart item shows product name', async ({ cartPage, page }) => {
    await cartPage.addItemAndNavigate();
    await expect(page.locator('.inventory_item_name').first()).toBeVisible();
  });

  test('cart item shows product price', async ({ cartPage, page }) => {
    await cartPage.addItemAndNavigate();
    await expect(page.locator('.inventory_item_price').first()).toBeVisible();
  });

  test('checkout button navigates to checkout step one', async ({ cartPage, page }) => {
    await cartPage.addItemAndNavigate();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('cart icon is always visible in the header', async ({ catalogPage }) => {
    await catalogPage.navigate();
    await expect(catalogPage.page.locator('#shopping_cart_container')).toBeVisible();
  });

});