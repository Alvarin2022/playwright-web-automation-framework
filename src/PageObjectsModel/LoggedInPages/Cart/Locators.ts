import { Page } from '@playwright/test';

export class Locators {
    constructor(private page: Page) {
        this.page = page;
    }

    /* Page Elements */
    pageTitle = () => this.page.locator('[data-test="title"]');
    cartList = () => this.page.locator('[data-test="cart-list"]');
    cartItems = () => this.page.locator('[data-test="inventory-item"]');
    cartItemNames = () => this.page.locator('[data-test="inventory-item-name"]');
    cartItemPrices = () => this.page.locator('[data-test="inventory-item-price"]');
    cartItemQuantities = () => this.page.locator('[data-test="item-quantity"]');

    /* Buttons */
    continueShoppingButton = () => this.page.locator('[data-test="continue-shopping"]');
    checkoutButton = () => this.page.locator('[data-test="checkout"]');

    /* Dynamic remove button per product */
    removeButtonByName = (productName: string) => {
        const dataTestId = `remove-${productName.toLowerCase().replace(/\s+/g, '-')}`;
        return this.page.locator(`[data-test="${dataTestId}"]`);
    };

    cartItemByName = (productName: string) =>
        this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
}