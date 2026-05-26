class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput    = page.getByLabel('Email:');
    this.passwordInput = page.getByLabel('Password:');
    this.loginButton   = page.getByRole('button', { name: 'Log in' });
    this.errorMessage  = page.locator('.message-error');
    this.logoutLink    = page.getByRole('link', { name: 'Log out' });
  }

  async navigate() {
    await this.page.goto('https://demo.nopcommerce.com/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}

module.exports = { LoginPage };