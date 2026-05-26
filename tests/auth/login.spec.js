const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/auth/LoginPage.js');
const users = require('../../test-data/users.json');

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {

  test('valid login redirects to account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);
    await page.waitForURL('https://demo.nopcommerce.com/', { timeout: 20000 });
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible({ timeout: 10000 });
  });

  test('invalid login shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

});