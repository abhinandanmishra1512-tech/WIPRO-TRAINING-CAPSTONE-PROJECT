const { test, expect } = require('../../fixtures/pageFixture');

test.describe('Module 04 – Checkout', () => {

  const startCheckout = (checkoutPage) => checkoutPage.addItemAndStartCheckout();

  test('TC_CHK_01 - step 1 loads with all form fields visible', async ({ checkoutPage, page }) => {
    await startCheckout(checkoutPage);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();
  });

  test('TC_CHK_02 - empty first name shows validation error', async ({ checkoutPage }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('', 'User', '12345');
    await checkoutPage.clickContinue();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('TC_CHK_03 - empty last name shows validation error', async ({ checkoutPage }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', '', '12345');
    await checkoutPage.clickContinue();
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('TC_CHK_04 - empty postal code shows validation error', async ({ checkoutPage }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', 'User', '');
    await checkoutPage.clickContinue();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('TC_CHK_05 - cancel on step 1 returns to cart', async ({ checkoutPage, page }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.clickCancel();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC_CHK_06 - valid info proceeds to step 2', async ({ checkoutPage, page }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC_CHK_07 - step 2 shows ordered items', async ({ checkoutPage }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getOrderItemCount()).toBeGreaterThan(0);
  });

  test('TC_CHK_08 - step 2 shows subtotal, tax and total labels', async ({ checkoutPage }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.clickContinue();
    await expect(checkoutPage.subtotalLabel).toBeVisible();
    await expect(checkoutPage.taxLabel).toBeVisible();
    await expect(checkoutPage.totalLabel).toBeVisible();
  });

  test('TC_CHK_09 - total equals subtotal + tax', async ({ checkoutPage }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.clickContinue();
    const subtotal = await checkoutPage.getSubtotal();
    const tax      = await checkoutPage.getTax();
    const total    = await checkoutPage.getTotal();
    expect(subtotal + tax).toBeCloseTo(total, 1);
  });

  test('TC_CHK_10 - Finish navigates to order complete page', async ({ checkoutPage, page }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('TC_CHK_11 - order complete page shows Thank You header', async ({ checkoutPage }) => {
    await checkoutPage.completeFullCheckout('John', 'Doe', '94102');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC_CHK_12 - order complete page shows dispatch confirmation text', async ({ checkoutPage }) => {
    await checkoutPage.completeFullCheckout('John', 'Doe', '94102');
    await expect(checkoutPage.completeText).toContainText('dispatched');
  });

  test('TC_CHK_13 - Back Home button returns to inventory', async ({ checkoutPage, page }) => {
    await checkoutPage.completeFullCheckout('Jane', 'Doe', '10001');
    await checkoutPage.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // cancelButton is the same data-test="cancel" on both step 1 and step 2
  test('TC_CHK_14 - cancel on step 2 returns to inventory', async ({ checkoutPage, page }) => {
    await startCheckout(checkoutPage);
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.clickContinue();
    await checkoutPage.clickCancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC_CHK_15 - pony express image visible on order complete', async ({ checkoutPage }) => {
    await checkoutPage.completeFullCheckout();
    await expect(checkoutPage.ponyExpressImage).toBeVisible();
  });

});
