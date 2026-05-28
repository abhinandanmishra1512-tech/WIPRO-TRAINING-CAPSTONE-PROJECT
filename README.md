# Wipro Training Capstone Project - Playwright

This repository contains the completed Capstone Project for Wipro Training, demonstrating end-to-end (E2E) testing capabilities using Playwright on the [SauceDemo](https://www.saucedemo.com/) application.

## 🚀 Project Overview

The project is structured into various modules to thoroughly test the application:

1.  **Authentication (`tests/auth`)**: Tests covering login flows for different users (valid, locked out, invalid credentials) and logout functionality.
2.  **Product Catalog (`tests/catalog`)**: Validates the inventory page, product details, images, pricing format, and sorting mechanisms.
3.  **Shopping Cart (`tests/cart`)**: Covers adding/removing items, cart badge updates, empty cart behavior, and verifying item details in the cart.
4.  **Checkout (`tests/checkout`)**: Tests the 3-step checkout process, form validation, order summary calculations (subtotal + tax = total), and order completion.
5.  **E2E User Journey (`tests/e2e`)**: Simulates complete real-world scenarios from login, browsing, adding items, checking out, and completing the order.
6.  **Navigation & Sidebar (`tests/profile`)**: Verifies the hamburger menu, sidebar links (All Items, About, Logout, Reset App State), and header elements.
7.  **Visual & Accessibility (`tests/support`)**: Checks document titles, alt texts for images, presence of `data-test` attributes, layout responsiveness, and basic keyboard accessibility.
8.  **User Types (`tests/wishlist`)**: Tests the distinct behaviors of SauceDemo users (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user`).

## 🛠️ Architecture & Optimization

-   **Page Object Model (POM)**: Implemented in the `pages/` directory (`LoginPage`, `ProductCatalogPage`, `CartPage`, `CheckoutPage`, `NavigationPage`) for maintainability.
-   **Fixtures (`fixtures/pageFixture.js`)**: Playwright fixtures automatically instantiate and inject Page Objects into every test, eliminating boilerplate code (`const page = new PageObject(page);`).
-   **Authentication State**: Playwright global setup runs `helpers/auth.setup.js` before the test suite to perform a UI login and save the session state (`test-data/auth.json`), bypassing repetitive logins for subsequent tests.
-   **Parallel Execution**: Tests are designed to be independent, allowing Playwright to run them fully in parallel for maximum speed.
-   **Reporting**: Configured with list, HTML, and Allure reporters.

## 📦 Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/abhinandanmishra1512-tech/WIPRO-TRAINING-CAPSTONE-PROJECT.git
    cd WIPRO-TRAINING-CAPSTONE-PROJECT
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Install Playwright browsers:
    ```bash
    npx playwright install --with-deps
    ```

## ▶️ Running Tests

The authentication state is generated automatically before Playwright runs. You can refresh it manually if needed:
```bash
npm run auth:setup
```

Run all tests in headless mode:
```bash
npm test
```

Run tests in UI mode (great for debugging):
```bash
npm run test:ui
```

Run tests in headed mode (watch the browser):
```bash
npm run test:headed
```

## 📊 Viewing Reports

After running tests, you can view the generated reports:

**HTML Report:**
```bash
npx playwright show-report
```

**Allure Report:**
Generate and open the Allure report:
```bash
npm run allure:generate
npm run allure:open
```

## ⚙️ CI/CD (GitHub Actions)

A GitHub Actions workflow is included (`.github/workflows/playwright.yml`). It automatically runs the test suite on every `push` and `pull_request` to the `main` or `master` branches, and archives the HTML and Allure test reports as artifacts.
