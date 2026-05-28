class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Step 1 – Checkout Information
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.cancelButton    = page.locator('[data-test="cancel"]');
    this.errorMessage    = page.locator('[data-test="error"]');

    // Step 2 – Order Overview
    this.orderItems    = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel      = page.locator('.summary_tax_label');
    this.totalLabel    = page.locator('.summary_total_label');
    this.finishButton  = page.locator('[data-test="finish"]');

    // Step 3 – Order Complete
    this.completeHeader   = page.locator('.complete-header');
    this.completeText     = page.locator('.complete-text');
    this.backHomeButton   = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('.pony_express');
  }

  async fillInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue() { await this.continueButton.click(); }
  async clickCancel()   { await this.cancelButton.click(); }
  async clickFinish()   { await this.finishButton.click(); }

  async getSubtotal() {
    return parseFloat((await this.subtotalLabel.innerText()).replace(/[^0-9.]/g, ''));
  }

  async getTax() {
    return parseFloat((await this.taxLabel.innerText()).replace(/[^0-9.]/g, ''));
  }

  async getTotal() {
    return parseFloat((await this.totalLabel.innerText()).replace(/[^0-9.]/g, ''));
  }

  async getOrderItemCount() {
    return await this.orderItems.count();
  }

  // Add first item from inventory, open cart, then start checkout
  async addItemAndStartCheckout() {
    await this.page.goto('/inventory.html');
    await this.page.locator('[data-test^="add-to-cart"]').first().click();
    await this.page.locator('#shopping_cart_container').click();
    await this.page.locator('[data-test="checkout"]').click();
  }

  // Full flow: inventory → checkout complete
  async completeFullCheckout(firstName = 'Test', lastName = 'User', postalCode = '12345') {
    await this.addItemAndStartCheckout();
    await this.fillInformation(firstName, lastName, postalCode);
    await this.clickContinue();
    await this.clickFinish();
  }
}

module.exports = { CheckoutPage };
