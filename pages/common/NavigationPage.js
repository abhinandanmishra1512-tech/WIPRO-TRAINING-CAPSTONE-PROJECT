/**
 * NavigationPage.js – Page Object for SauceDemo global navigation
 *
 * Covers:
 *  - The hamburger sidebar menu (open/close, all links)
 *  - The shopping cart header icon
 *  - The page title header
 */
class NavigationPage {
  constructor(page) {
    this.page = page;

    // ── Hamburger Sidebar ─────────────────────────────────────────────────────
    this.burgerMenuButton  = page.locator('#react-burger-menu-btn');
    this.burgerCloseButton = page.locator('#react-burger-cross-btn');
    this.sidebarMenu       = page.locator('.bm-menu-wrap');

    // ── Sidebar links ─────────────────────────────────────────────────────────
    this.allItemsLink         = page.locator('#inventory_sidebar_link');
    this.aboutLink            = page.locator('#about_sidebar_link');
    this.logoutLink           = page.locator('#logout_sidebar_link');
    this.resetAppStateLink    = page.locator('#reset_sidebar_link');

    // ── Header ────────────────────────────────────────────────────────────────
    this.cartIcon      = page.locator('#shopping_cart_container');
    this.cartBadge     = page.locator('.shopping_cart_badge');
    this.appLogo       = page.locator('.app_logo');
    this.pageTitle     = page.locator('.title');
    this.headerWrapper = page.locator('.primary_header');
  }

  async navigate() {
    await this.page.goto('/inventory.html');
  }

  async openSidebar() {
    await this.burgerMenuButton.click();
    await this.sidebarMenu.waitFor({ state: 'visible' });
  }

  async closeSidebar() {
    await this.burgerCloseButton.click();
    await this.sidebarMenu.waitFor({ state: 'hidden' });
  }

  async clickAllItems() {
    await this.allItemsLink.click();
  }

  async clickAbout() {
    await this.aboutLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.resetAppStateLink.click();
    await this.closeSidebar();
  }

  async navigateToCart() {
    await this.cartIcon.click();
  }

  async getCartBadgeCount() {
    if (!await this.cartBadge.isVisible()) return 0;
    return parseInt(await this.cartBadge.innerText(), 10);
  }
}

module.exports = { NavigationPage };
