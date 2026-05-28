class ProductCatalogPage {
  constructor(page) {
    this.page         = page;
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.sortDropdown = page.locator('.product_sort_container');
    this.pageTitle    = page.locator('.title');
    this.addToCartBtn = page.locator('[data-test^="add-to-cart"]');
  }

  async navigate() {
    await this.page.goto('/inventory.html');
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async sortBy(value) {
    await this.sortDropdown.selectOption(value);
  }

  async getFirstProductName() {
    return await this.productNames.first().innerText();
  }

  async clickFirstProduct() {
    await this.productItems.first().locator('.inventory_item_name').click();
  }

  async addFirstProductToCart() {
    await this.addToCartBtn.first().click();
  }

  async addAllProductsToCart() {
    const count = await this.addToCartBtn.count();
    for (let i = 0; i < count; i++) {
      await this.addToCartBtn.first().click();
    }
  }
}

module.exports = { ProductCatalogPage };