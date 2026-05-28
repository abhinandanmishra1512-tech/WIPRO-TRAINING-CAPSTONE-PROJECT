const { chromium } = require('@playwright/test');
const path = require('path');
const users = require('../test-data/users.json');

/**
 * Playwright globalSetup — runs once before the entire test suite.
 * Logs in and saves the browser storage state to test-data/auth.json
 * so all subsequent tests can reuse the session without repeating login.
 */
module.exports = async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page    = await context.newPage();

  await page.goto('https://www.saucedemo.com', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test="username"]').fill(users.validUser.username);
  await page.locator('[data-test="password"]').fill(users.validUser.password);
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL('**/inventory.html', { timeout: 15000 });

  await context.storageState({ path: path.join('test-data', 'auth.json') });
  await browser.close();
};
