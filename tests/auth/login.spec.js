const { test, expect } = require('../../fixtures/pageFixture');
const users = require('../../test-data/users.json');

// Auth tests start unauthenticated — override global storageState
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Module 01 – Authentication', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('valid login redirects to inventory page', async ({ loginPage, page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('locked out user sees error message', async ({ loginPage }) => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('invalid credentials shows error message', async ({ loginPage }) => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('empty username shows validation error', async ({ loginPage }) => {
    await loginPage.login('', users.validUser.password);
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('empty password shows validation error', async ({ loginPage }) => {
    await loginPage.login(users.validUser.username, '');
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('empty credentials shows validation error', async ({ loginPage }) => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('login page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('login page shows username and password fields', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('login page has login button', async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('logout works after login', async ({ loginPage, page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);
    await loginPage.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('invalid login keeps user on login page', async ({ loginPage, page }) => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('problem_user can log in successfully', async ({ loginPage, page }) => {
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

});