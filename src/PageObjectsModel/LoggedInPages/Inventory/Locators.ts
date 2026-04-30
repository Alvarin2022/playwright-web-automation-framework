import { Page } from '@playwright/test';

/**
 * Selectores de la página de Inventario (catálogo de productos).
 */
export class Locators {
    constructor(private page: Page) {
        this.page = page;
    }

    /* Page Container */
    inventoryContainer = () => this.page.locator('[data-test="inventory-container"]');
    pageTitle = () => this.page.locator('[data-test="title"]');

    /* Sort Dropdown */
    sortDropdown = () => this.page.locator('[data-test="product-sort-container"]');

    /* Product List */
    inventoryItems = () => this.page.locator('[data-test="inventory-item"]');
    inventoryItemNames = () => this.page.locator('[data-test="inventory-item-name"]');
    inventoryItemPrices = () => this.page.locator('[data-test="inventory-item-price"]');
    inventoryItemDescriptions = () => this.page.locator('[data-test="inventory-item-desc"]');

    /* Buttons by product name (dynamic) */
    addToCartButtonByName = (productName: string) => {
        const dataTestId = `add-to-cart-${this.slugify(productName)}`;
        return this.page.locator(`[data-test="${dataTestId}"]`);
    };

    removeButtonByName = (productName: string) => {
        const dataTestId = `remove-${this.slugify(productName)}`;
        return this.page.locator(`[data-test="${dataTestId}"]`);
    };

    /* Product Card by name */
    productCardByName = (productName: string) =>
        this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });

    /**
     * Convierte el nombre de un producto al formato del data-test attribute.
     * Ejemplo: "Sauce Labs Backpack" -> "sauce-labs-backpack"
     */
    private slugify(productName: string): string {
        return productName.toLowerCase().replace(/\s+/g, '-');
    }
}