const { test, expect } = require('../../fixtures/pageFixture');

// Visual & accessibility tests — some start unauthenticated
test.describe('Module 08 – Visual & Accessibility', () => {

  test('TC_VIS_01 - login page has correct document title', async ({ loginPage, page }) => {
    await page.context().clearCookies();
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('TC_VIS_02 - login page logo text is "Swag Labs"', async ({ loginPage, page }) => {
    await page.context().clearCookies();
    await loginPage.navigate();
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
  });

  test('TC_VIS_03 - username and password fields have placeholder text', async ({ loginPage, page }) => {
    await page.context().clearCookies();
    await loginPage.navigate();
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
  });

  test('TC_VIS_04 - login button is of type submit', async ({ loginPage, page }) => {
    await page.context().clearCookies();
    await loginPage.navigate();
    await expect(loginPage.loginButton).toHaveAttribute('type', 'submit');
  });

  test('TC_VIS_05 - inventory page has correct document title', async ({ catalogPage, page }) => {
    await catalogPage.navigate();
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('TC_VIS_06 - all product images have non-empty alt attributes', async ({ catalogPage, page }) => {
    await catalogPage.navigate();
    const images = page.locator('.inventory_item img');
    const count  = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt?.trim()).toBeTruthy();
    }
  });

  test('TC_VIS_07 - six Add to Cart buttons with correct data-test attributes', async ({ catalogPage, page }) => {
    await catalogPage.navigate();
    const buttons = page.locator('[data-test^="add-to-cart"]');
    expect(await buttons.count()).toBe(6);
  });

  test('TC_VIS_08 - cart icon has a navigable anchor tag', async ({ catalogPage, page }) => {
    await catalogPage.navigate();
    await expect(page.locator('#shopping_cart_container a')).toBeVisible();
  });

  test('TC_VIS_09 - invalid login shows visible error container', async ({ loginPage, page }) => {
    await page.context().clearCookies();
    await loginPage.navigate();
    await loginPage.login('bad_user', 'bad_pass');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toBeEmpty();
  });

  test('TC_VIS_10 - Enter key on password field submits login', async ({ loginPage, page }) => {
    await page.context().clearCookies();
    await loginPage.navigate();
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.passwordInput.press('Enter');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_VIS_11 - product items visible on mobile viewport (375×667)', async ({ catalogPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await catalogPage.navigate();
    await expect(catalogPage.productItems.first()).toBeVisible();
  });

  test('TC_VIS_12 - sort dropdown default value is "az" (A to Z)', async ({ catalogPage }) => {
    await catalogPage.navigate();
    await expect(catalogPage.sortDropdown).toBeVisible();
    expect(await catalogPage.sortDropdown.inputValue()).toBe('az');
  });

  test('TC_VIS_13 - checkout step 1 form fields have data-test attributes', async ({ checkoutPage, page }) => {
    await checkoutPage.addItemAndStartCheckout();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('TC_VIS_14 - product detail page shows product image', async ({ catalogPage, page }) => {
    await catalogPage.navigate();
    await catalogPage.clickFirstProduct();
    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });

  test('TC_VIS_15 - no horizontal overflow on 1280px desktop viewport', async ({ catalogPage, page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await catalogPage.navigate();
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth   = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

});
