class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems        = page.locator('tr.cart-item-row');
    this.checkoutButton   = page.getByRole('button', { name: 'Checkout' });
    this.emptyCartMessage = page.getByText('Your Shopping Cart is empty!');
    this.updateCartButton = page.getByRole('button', { name: 'Update shopping cart' });
    this.discountInput    = page.locator('#discountcouponcode');
    this.applyDiscountBtn = page.getByRole('button', { name: 'Apply coupon' });
    this.cartBadge        = page.locator('.cart-qty');
    this.removeButtons    = page.locator('.remove-btn');
    this.subTotal         = page.locator('.cart-total');
  }

  async navigate() {
    await this.page.goto('/cart');
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async removeFirstItem() {
    await this.removeButtons.first().click();
    await this.updateCartButton.click();
  }

  async applyDiscount(code) {
    await this.discountInput.fill(code);
    await this.applyDiscountBtn.click();
  }
}

module.exports = { CartPage };