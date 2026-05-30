/**
 * ProductDetailPage.js – Page Object for SauceDemo product detail page
 *
 * Covers:
 *  - Product name, description, price, image
 *  - Add to Cart / Remove button toggle
 *  - Back to Products navigation
 *  - Cart badge in header
 */
class ProductDetailPage {
  constructor(page) {
    this.page = page;

    // ── Product details ───────────────────────────────────────────────────────
    this.productName  = page.locator('.inventory_details_name');
    this.productDesc  = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.productImage = page.locator('.inventory_details_img');

    // ── Action buttons ────────────────────────────────────────────────────────
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton    = page.locator('[data-test^="remove"]');
    this.backButton      = page.locator('[data-test="back-to-products"]');

    // ── Header ────────────────────────────────────────────────────────────────
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon  = page.locator('#shopping_cart_container');
  }

  /**
   * Navigate directly to a product detail page by numeric product ID.
   * Default id=4 is "Sauce Labs Backpack" — a stable, always-present product.
   */
  async navigate(productId = 4) {
    await this.page.goto(`/inventory-item.html?id=${productId}`);
  }

  /** Navigate to catalog, click the first product, and arrive on detail page. */
  async openFirstProductFromCatalog() {
    await this.page.goto('/inventory.html');
    const firstName = await this.page.locator('.inventory_item_name').first().innerText();
    await this.page.locator('.inventory_item_name').first().click();
    return firstName;
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }

  async getProductName() {
    return (await this.productName.innerText()).trim();
  }

  async getProductPrice() {
    return (await this.productPrice.innerText()).trim();
  }

  async getCartBadgeCount() {
    if (!await this.cartBadge.isVisible()) return 0;
    return parseInt(await this.cartBadge.innerText(), 10);
  }
}

module.exports = { ProductDetailPage };
