const base = require('@playwright/test');

const { LoginPage }          = require('../pages/auth/LoginPage');
const { ProductCatalogPage } = require('../pages/catalog/ProductCatalogPage');
const { CartPage }           = require('../pages/cart/CartPage');
const { CheckoutPage }       = require('../pages/checkout/CheckoutPage');
const { NavigationPage }     = require('../pages/common/NavigationPage');

exports.test = base.test.extend({
  loginPage:    async ({ page }, use) => use(new LoginPage(page)),
  catalogPage:  async ({ page }, use) => use(new ProductCatalogPage(page)),
  cartPage:     async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  navPage:      async ({ page }, use) => use(new NavigationPage(page)),
});

exports.expect = base.expect;
