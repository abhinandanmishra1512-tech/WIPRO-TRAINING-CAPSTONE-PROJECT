const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/auth/LoginPage.js');
const users = require('../../test-data/users.json');

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {

  test('valid login redirects to homepage', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);
    await page.waitForURL(
      url => url.href.includes('nopcommerce.com/') && !url.href.includes('/login'),
      { timeout: 15000 }
    );
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  });

  test('invalid login shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('empty email and password shows validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', '');
    await expect(page).toHaveURL(/login/);
  });

  test('empty email only shows validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', users.validUser.password);
    await expect(page).toHaveURL(/login/);
  });

  test('invalid email format is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('notanemail', users.validUser.password);
    await expect(page).toHaveURL(/login/);
  });

  test('login page has correct title', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Log in/);
  });

  test('login page has email and password fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('login page has register link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('forgot password link is visible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });

  test('forgot password page loads correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL(/passwordrecovery/);
  });

  test('logout works after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);
    await page.waitForURL(
      url => !url.href.includes('/login'),
      { timeout: 15000 }
    );
    await loginPage.logout();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });

  test('guest user sees login link in header', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });

  test('registered user sees account link after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);
    await page.waitForURL(
      url => !url.href.includes('/login'),
      { timeout: 15000 }
    );
    await expect(page.getByRole('link', { name: 'My account' })).toBeVisible();
  });

});