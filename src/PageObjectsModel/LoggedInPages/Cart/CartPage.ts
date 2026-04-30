import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';
import { Header } from '../../Components/Header/Header';

export class CartPage {
    private locators: Locators;
    public header: Header;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
        this.header = new Header(page);
    }

    async assertCartScreenVisible(): Promise<void> {
        await expect(this.locators.pageTitle(), 'Expected page title to be Your Cart').toHaveText('Your Cart');
        await expect(this.locators.cartList(), 'Expected cart list to be visible').toBeVisible();
    }

    /**
     * Verifica que un producto específico esté en el carrito.
     */
    async assertProductInCart(productName: string): Promise<void> {
        await expect(
            this.locators.cartItemByName(productName),
            `Expected product "${productName}" to be in cart`
        ).toBeVisible();
    }

    /**
     * Verifica que múltiples productos estén en el carrito.
     */
    async assertProductsInCart(productNames: string[]): Promise<void> {
        for (const name of productNames) {
            await this.assertProductInCart(name);
        }
        await expect(this.locators.cartItems(), `Expected ${productNames.length} items in cart`).toHaveCount(productNames.length);
    }

    /**
     * Remueve un producto del carrito.
     */
    async removeProduct(productName: string): Promise<void> {
        await this.locators.removeButtonByName(productName).click();
        await expect(
            this.locators.cartItemByName(productName),
            `Expected "${productName}" to be removed from cart`
        ).toBeHidden();
    }

    /**
     * Continúa comprando (vuelve al inventario).
     */
    async continueShopping(): Promise<void> {
        await this.locators.continueShoppingButton().click();
    }

    /**
     * Procede al checkout.
     */
    async proceedToCheckout(): Promise<void> {
        await this.locators.checkoutButton().click();
    }

    /**
     * Devuelve los nombres de los productos en el carrito.
     */
    async getCartProductNames(): Promise<string[]> {
        return await this.locators.cartItemNames().allTextContents();
    }

    /**
     * Devuelve los precios como números.
     */
    async getCartPrices(): Promise<number[]> {
        const priceTexts = await this.locators.cartItemPrices().allTextContents();
        return priceTexts.map((text) => parseFloat(text.replace('$', '')));
    }
}