import { Page } from '@playwright/test';

export class Locators {
    constructor(private page: Page) {
        this.page = page;
    }

    pageTitle = () => this.page.locator('[data-test="title"]');
    cartItems = () => this.page.locator('[data-test="inventory-item"]');
    itemNames = () => this.page.locator('[data-test="inventory-item-name"]');
    itemPrices = () => this.page.locator('[data-test="inventory-item-price"]');

    paymentInfo = () => this.page.locator('[data-test="payment-info-value"]');
    shippingInfo = () => this.page.locator('[data-test="shipping-info-value"]');
    subtotalLabel = () => this.page.locator('[data-test="subtotal-label"]');
    taxLabel = () => this.page.locator('[data-test="tax-label"]');
    totalLabel = () => this.page.locator('[data-test="total-label"]');

    cancelButton = () => this.page.locator('[data-test="cancel"]');
    finishButton = () => this.page.locator('[data-test="finish"]');
}