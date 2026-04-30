import { Page } from '@playwright/test';

/**
 * Selectores del Header de SauceDemo.
 * Componente compartido visible en todas las páginas post-login.
 */
export class Locators {
    constructor(private page: Page) {
        this.page = page;
    }

    /* App Branding */
    appLogo = () => this.page.locator('.app_logo');

    /* Cart */
    cartIcon = () => this.page.locator('[data-test="shopping-cart-link"]');
    cartBadge = () => this.page.locator('[data-test="shopping-cart-badge"]');

    /* Burger Menu */
    burgerMenuButton = () => this.page.locator('#react-burger-menu-btn');
    closeMenuButton = () => this.page.locator('#react-burger-cross-btn');
    inventoryLink = () => this.page.locator('[data-test="inventory-sidebar-link"]');
    aboutLink = () => this.page.locator('[data-test="about-sidebar-link"]');
    logoutLink = () => this.page.locator('[data-test="logout-sidebar-link"]');
    resetAppStateLink = () => this.page.locator('[data-test="reset-sidebar-link"]');
}