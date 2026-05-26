class ProductCatalogPage {
  constructor(page) {
    this.page         = page;
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.sortDropdown = page.locator('.product_sort_container');
    this.pageTitle    = page.locator('.title');
  }

  async navigate() {
    await this.page.goto('/inventory.html');
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async sortBy(value) {
    // values: 'az', 'za', 'lohi', 'hilo'
    await this.sortDropdown.selectOption(value);
  }

  async getFirstProductName() {
    return await this.productNames.first().innerText();
  }

  async clickFirstProduct() {
    await this.productItems.first().locator('.inventory_item_name').click();
  }

  async addFirstProductToCart() {
    await this.productItems.first().locator('button').click();
  }
}

module.exports = { ProductCatalogPage };