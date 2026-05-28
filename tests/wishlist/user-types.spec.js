const { test, expect } = require('../../fixtures/pageFixture');
const users = require('../../test-data/users.json');

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Module 09 – User Types & Behaviour', () => {

  // ── standard_user ─────────────────────────────────────────────────────────

  test('TC_USR_01 - standard_user logs in and sees Products page', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC_USR_02 - standard_user can add all items to cart without errors', async ({ loginPage, catalogPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await catalogPage.addAllProductsToCart();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
  });

  test('TC_USR_03 - standard_user can sort products by every option', async ({ loginPage, catalogPage }) => {
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);
    for (const val of ['az', 'za', 'lohi', 'hilo']) {
      await catalogPage.sortBy(val);
      expect(await catalogPage.sortDropdown.inputValue()).toBe(val);
    }
  });

  test('TC_USR_04 - standard_user completes full checkout flow', async ({ loginPage, checkoutPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await checkoutPage.completeFullCheckout('Standard', 'User', '10001');
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  // ── locked_out_user ────────────────────────────────────────────────────────

  test('TC_USR_05 - locked_out_user cannot login and sees error', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('TC_USR_06 - locked_out_user stays on login page', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  // ── problem_user ───────────────────────────────────────────────────────────

  test('TC_USR_07 - problem_user can log in and reach inventory', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.problemUser.username, users.problemUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_USR_08 - problem_user sees 6 products on inventory page', async ({ loginPage, catalogPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.problemUser.username, users.problemUser.password);
    expect(await catalogPage.getProductCount()).toBe(6);
  });

  // ── performance_glitch_user ────────────────────────────────────────────────

  test('TC_USR_09 - performance_glitch_user logs in (may be slow)', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.performanceGlitchUser.username, users.performanceGlitchUser.password);
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 15000 });
  });

  test('TC_USR_10 - performance_glitch_user reaches inventory with products', async ({ loginPage, catalogPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.performanceGlitchUser.username, users.performanceGlitchUser.password);
    await page.waitForURL(/inventory\.html/, { timeout: 15000 });
    await expect(catalogPage.productItems.first()).toBeVisible({ timeout: 15000 });
  });

  // ── error_user ─────────────────────────────────────────────────────────────

  test('TC_USR_11 - error_user can log in and reach inventory', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.errorUser.username, users.errorUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_USR_12 - error_user sees all 6 products on inventory page', async ({ loginPage, catalogPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.errorUser.username, users.errorUser.password);
    expect(await catalogPage.getProductCount()).toBe(6);
  });

  // ── visual_user ────────────────────────────────────────────────────────────

  test('TC_USR_13 - visual_user can log in and reach inventory', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.visualUser.username, users.visualUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_USR_14 - visual_user sees Products title on inventory', async ({ loginPage, catalogPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.visualUser.username, users.visualUser.password);
    await expect(catalogPage.pageTitle).toHaveText('Products');
  });

  // ── cross-user ─────────────────────────────────────────────────────────────

  test('TC_USR_15 - invalid credentials always show error', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

});
