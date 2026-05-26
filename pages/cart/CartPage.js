class CartPage {
  constructor(page) {
    this.page             = page;
    this.cartItems        = page.locator('.cart_item');
    this.checkoutButton   = page.locator('[data-test="checkout"]');
    this.continueShopBtn  = page.locator('[data-test="continue-shopping"]');
    this.cartBadge        = page.locator('.shopping_cart_badge');
    this.removeButtons    = page.locator('[data-test^="remove"]');
    this.cartTitle        = page.locator('.title');
  }

  async navigate() {
    await this.page.goto('/cart.html');
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async removeFirstItem() {
    await this.removeButtons.first().click();
  }

  async continueShopping() {
    await this.continueShopBtn.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };