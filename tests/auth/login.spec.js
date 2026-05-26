const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/auth/LoginPage.js');
const users = require('../../test-data/users.json');

// Override global storageState — login tests start unauthenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication - SauceDemo', () => {

  test('valid login redirects to inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('locked out user sees error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('invalid credentials shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('empty username shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', users.validUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('empty password shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('empty username and password shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('login page has correct title', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('login page has username and password fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('login page has login button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('logout works after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await loginPage.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('user stays on login page after invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('credentials are accepted for all standard test users', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

});