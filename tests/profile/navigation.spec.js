const { test, expect } = require('../../fixtures/pageFixture');

test.describe('Module 07 – Navigation & Sidebar', () => {

  test.beforeEach(async ({ navPage }) => {
    await navPage.navigate();
  });

  test('TC_NAV_01 - header wrapper is visible', async ({ navPage }) => {
    await expect(navPage.headerWrapper).toBeVisible();
  });

  test('TC_NAV_02 - Swag Labs logo is visible in header', async ({ navPage }) => {
    await expect(navPage.appLogo).toHaveText('Swag Labs');
  });

  test('TC_NAV_03 - burger menu button is visible', async ({ navPage }) => {
    await expect(navPage.burgerMenuButton).toBeVisible();
  });

  test('TC_NAV_04 - clicking burger opens the sidebar', async ({ navPage }) => {
    await navPage.openSidebar();
    await expect(navPage.sidebarMenu).toBeVisible();
  });

  test('TC_NAV_05 - sidebar shows all four links', async ({ navPage }) => {
    await navPage.openSidebar();
    await expect(navPage.allItemsLink).toBeVisible();
    await expect(navPage.aboutLink).toBeVisible();
    await expect(navPage.logoutLink).toBeVisible();
    await expect(navPage.resetAppStateLink).toBeVisible();
  });

  test('TC_NAV_06 - clicking X closes the sidebar', async ({ navPage }) => {
    await navPage.openSidebar();
    await navPage.closeSidebar();
    await expect(navPage.sidebarMenu).not.toBeVisible();
  });

  test('TC_NAV_07 - All Items link goes to inventory', async ({ navPage, page }) => {
    await page.goto('/cart.html');
    await navPage.openSidebar();
    await navPage.clickAllItems();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_NAV_08 - About link navigates to Sauce Labs site', async ({ navPage, page }) => {
    await navPage.openSidebar();
    await navPage.clickAbout();
    await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('TC_NAV_09 - Logout link logs the user out', async ({ navPage, page }) => {
    await navPage.openSidebar();
    await navPage.clickLogout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('TC_NAV_10 - Reset App State clears the cart', async ({ navPage, page }) => {
    await page.locator('[data-test^="add-to-cart"]').first().click();
    await expect(navPage.cartBadge).toHaveText('1');
    await navPage.openSidebar();
    await navPage.resetAppState();
    await expect(navPage.cartBadge).not.toBeVisible();
  });

  test('TC_NAV_11 - cart icon is visible in header', async ({ navPage }) => {
    await expect(navPage.cartIcon).toBeVisible();
  });

  test('TC_NAV_12 - clicking cart icon goes to cart page', async ({ navPage, page }) => {
    await navPage.navigateToCart();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC_NAV_13 - cart badge count increments correctly', async ({ navPage, page }) => {
    expect(await navPage.getCartBadgeCount()).toBe(0);
    await page.locator('[data-test^="add-to-cart"]').first().click();
    expect(await navPage.getCartBadgeCount()).toBe(1);
    await page.locator('[data-test^="add-to-cart"]').first().click();
    expect(await navPage.getCartBadgeCount()).toBe(2);
  });

  test('TC_NAV_14 - inventory page title is "Products"', async ({ navPage }) => {
    await expect(navPage.pageTitle).toHaveText('Products');
  });

  test('TC_NAV_15 - cart page title is "Your Cart"', async ({ navPage, page }) => {
    await page.goto('/cart.html');
    await expect(navPage.pageTitle).toHaveText('Your Cart');
  });

});
