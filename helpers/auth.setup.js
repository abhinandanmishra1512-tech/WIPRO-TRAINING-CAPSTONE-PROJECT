const { chromium } = require('@playwright/test');

async function saveLoginState() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://demo.nopcommerce.com/login');
  await page.getByLabel('Email:').fill('abhinandanmishra1512@gmail.com');
  await page.getByLabel('Password:').fill('Test@12345');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL('https://demo.nopcommerce.com/');

  await context.storageState({ path: 'test-data/auth.json' });
  await browser.close();
  console.log('Auth state saved successfully');
}

saveLoginState();