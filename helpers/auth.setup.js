const { chromium } = require('@playwright/test');
const path = require('path');
const users = require('../test-data/users.json');

async function saveLoginState() {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Logging into saucedemo.com...');
  await page.goto('https://www.saucedemo.com', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-test="username"]').fill(users.validUser.username);
  await page.locator('[data-test="password"]').fill(users.validUser.password);
  await page.locator('[data-test="login-button"]').click();

  // Wait for inventory page to confirm successful login
  await page.waitForURL('**/inventory.html', { timeout: 15000 });
  console.log('Login successful! Saving auth state...');

  await context.storageState({ path: path.join('test-data', 'auth.json') });
  console.log('Auth state saved to test-data/auth.json');

  await browser.close();
}

saveLoginState().catch(err => {
  console.error('Auth setup failed:', err.message);
  process.exit(1);
});
