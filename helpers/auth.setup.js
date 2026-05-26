const { chromium } = require('@playwright/test');

async function saveLoginState() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome'
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://demo.nopcommerce.com/login');
  
  console.log('Browser opened. Please:');
  console.log('1. Solve the Cloudflare captcha');
  console.log('2. Log in with your credentials');
  console.log('Waiting up to 2 minutes...');
  
  await page.waitForURL(
    url => !url.href.includes('/login'),
    { timeout: 120000 }
  );

  await context.storageState({ path: 'test-data/auth.json' });
  await browser.close();
  console.log('Auth state saved successfully!');
}

saveLoginState();