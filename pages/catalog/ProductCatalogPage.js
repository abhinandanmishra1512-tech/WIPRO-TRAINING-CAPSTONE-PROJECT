class ProductCatalogPage {
  constructor(page) {
    this.page = page;
    this.searchInput  = page.getByPlaceholder('Search store');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.productItems = page.locator('.product-item');
    this.sortDropdown = page.locator('#products-orderby');
    this.gridViewBtn  = page.locator('#grid-view-button');
    this.listViewBtn  = page.locator('#list-view-button');
    this.noResultsMsg = page.locator('.no-result');
    this.pageTitle    = page.locator('.page-title');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async searchFor(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async sortBy(value) {
    await this.sortDropdown.selectOption(value);
  }
}

module.exports = { ProductCatalogPage };