import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';
import { Header } from '../../Components/Header/Header';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Page Object de la página de Inventario (catálogo de productos).
 */
export class InventoryPage {
    private locators: Locators;
    public header: Header;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
        this.header = new Header(page);
    }

    /**
     * Verifica que la página de inventario esté visible.
     */
    async assertInventoryScreenVisible(): Promise<void> {
        await expect(this.locators.inventoryContainer(), 'Expected inventory container to be visible').toBeVisible();
        await expect(this.locators.pageTitle(), 'Expected page title to be Products').toHaveText('Products');
        await this.header.assertHeaderVisible();
    }

    /**
     * Agrega un producto al carrito por nombre.
     */
    async addProductToCart(productName: string): Promise<void> {
        const button = this.locators.addToCartButtonByName(productName);
        await expect(button, `Expected Add to Cart button for "${productName}" to be visible`).toBeVisible();
        await button.click();
        // Después del click, el botón se transforma en "Remove"
        await expect(this.locators.removeButtonByName(productName), `Expected Remove button for "${productName}" to appear after adding to cart`).toBeVisible();
    }

    /**
     * Remueve un producto del carrito desde la página de inventario.
     */
    async removeProductFromCart(productName: string): Promise<void> {
        const button = this.locators.removeButtonByName(productName);
        await expect(button, `Expected Remove button for "${productName}" to be visible`).toBeVisible();
        await button.click();
    }

    /**
     * Agrega múltiples productos al carrito.
     */
    async addMultipleProductsToCart(productNames: string[]): Promise<void> {
        for (const name of productNames) {
            await this.addProductToCart(name);
        }
    }

    /**
     * Devuelve la cantidad total de productos visibles en el catálogo.
     */
    async getProductsCount(): Promise<number> {
        return await this.locators.inventoryItems().count();
    }

    /**
     * Verifica que la cantidad de productos visibles sea la esperada.
     */
    async assertProductsCount(expected: number): Promise<void> {
        await expect(this.locators.inventoryItems(), `Expected ${expected} products to be visible`).toHaveCount(expected);
    }

    /**
     * Selecciona una opción del dropdown de ordenamiento.
     */
    async sortBy(option: SortOption): Promise<void> {
        await this.locators.sortDropdown().selectOption(option);
    }

    /**
     * Devuelve los nombres de todos los productos en el orden mostrado.
     */
    async getProductNames(): Promise<string[]> {
        return await this.locators.inventoryItemNames().allTextContents();
    }

    /**
     * Devuelve los precios como números, en el orden mostrado.
     */
    async getProductPrices(): Promise<number[]> {
        const priceTexts = await this.locators.inventoryItemPrices().allTextContents();
        return priceTexts.map((text) => parseFloat(text.replace('$', '')));
    }
}