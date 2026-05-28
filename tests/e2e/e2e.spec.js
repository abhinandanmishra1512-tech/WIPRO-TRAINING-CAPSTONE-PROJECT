const { test, expect } = require('../../fixtures/pageFixture');
const users = require('../../test-data/users.json');

test.describe('Module 05 – E2E User Journey', () => {

  // TC_E2E_01 needs a clean unauthenticated state
  test.describe('unauthenticated', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('TC_E2E_01 - login then see product catalog', async ({ loginPage, catalogPage, page }) => {
      await loginPage.navigate();
      await loginPage.login(users.validUser.username, users.validUser.password);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(catalogPage.pageTitle).toHaveText('Products');
      expect(await catalogPage.getProductCount()).toBe(6);
    });
  });

  test('TC_E2E_02 - sort products by price low to high in correct order', async ({ catalogPage, page }) => {
    await catalogPage.navigate();
    await catalogPage.sortBy('lohi');
    const nums = (await page.locator('.inventory_item_price').allInnerTexts())
      .map(p => parseFloat(p.replace('$', '')));
    for (let i = 0; i < nums.length - 1; i++) {
      expect(nums[i]).toBeLessThanOrEqual(nums[i + 1]);
    }
  });

  test('TC_E2E_03 - add multiple items, badge shows correct count', async ({ catalogPage }) => {
    await catalogPage.navigate();
    await catalogPage.addFirstProductToCart();
    await catalogPage.addFirstProductToCart();
    await catalogPage.addFirstProductToCart();
    await expect(catalogPage.page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('TC_E2E_04 - cart shows all added items', async ({ catalogPage, cartPage }) => {
    await catalogPage.navigate();
    await catalogPage.addFirstProductToCart();
    await catalogPage.addFirstProductToCart();
    await cartPage.navigate();
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test('TC_E2E_05 - remove an item from cart before checkout', async ({ catalogPage, cartPage }) => {
    await catalogPage.navigate();
    await catalogPage.addFirstProductToCart();
    await catalogPage.addFirstProductToCart();
    await cartPage.navigate();
    await cartPage.removeFirstItem();
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('TC_E2E_06 - proceed from cart to checkout step 1', async ({ cartPage, page }) => {
    await cartPage.addItemAndNavigate();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC_E2E_07 - complete checkout with valid shipping info', async ({ cartPage, checkoutPage, page }) => {
    await cartPage.addItemAndNavigate();
    await cartPage.checkout();
    await checkoutPage.fillInformation('John', 'Doe', '94102');
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC_E2E_08 - order overview total = subtotal + tax', async ({ cartPage, checkoutPage }) => {
    await cartPage.addItemAndNavigate();
    await cartPage.checkout();
    await checkoutPage.fillInformation('John', 'Doe', '94102');
    await checkoutPage.clickContinue();
    const subtotal = await checkoutPage.getSubtotal();
    const tax      = await checkoutPage.getTax();
    const total    = await checkoutPage.getTotal();
    expect(subtotal + tax).toBeCloseTo(total, 1);
  });

  test('TC_E2E_09 - finishing order shows order complete page', async ({ checkoutPage, page }) => {
    await checkoutPage.completeFullCheckout('Jane', 'Smith', '10001');
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC_E2E_10 - back home after order returns to inventory', async ({ catalogPage, checkoutPage, page }) => {
    await checkoutPage.completeFullCheckout('Jane', 'Smith', '10001');
    await checkoutPage.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(catalogPage.pageTitle).toHaveText('Products');
  });

  test('TC_E2E_11 - cart badge gone after order is placed', async ({ checkoutPage, page }) => {
    await checkoutPage.completeFullCheckout();
    await checkoutPage.backHomeButton.click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC_E2E_12 - full flow: product detail → cart → checkout → complete', async ({ catalogPage, cartPage, checkoutPage, page }) => {
    await catalogPage.navigate();
    await catalogPage.clickFirstProduct();
    await page.locator('[data-test^="add-to-cart"]').click();
    await cartPage.navigate();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Alice', 'Wonderland', '99999');
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('TC_E2E_13 - user can log out from inventory', async ({ loginPage, catalogPage, page }) => {
    await catalogPage.navigate();
    await loginPage.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('TC_E2E_14 - all 6 products can be added to cart', async ({ catalogPage, page }) => {
    await catalogPage.navigate();
    await catalogPage.addAllProductsToCart();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
  });

  test('TC_E2E_15 - checkout with all 6 items shows correct count on overview', async ({ catalogPage, cartPage, checkoutPage }) => {
    await catalogPage.navigate();
    await catalogPage.addAllProductsToCart();
    await cartPage.navigate();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Bulk', 'Buyer', '00001');
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getOrderItemCount()).toBe(6);
  });

});
