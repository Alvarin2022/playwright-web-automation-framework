import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';

/**
 * Componente Header presente en todas las páginas post-login.
 * Encapsula el logo, el menú hamburguesa y el icono del carrito.
 */
export class Header {
    private locators: Locators;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
    }

    /**
     * Hace click en el icono del carrito y navega a la cart page.
     */
    async goToCart(): Promise<void> {
        await this.locators.cartIcon().click();
    }

    /**
     * Devuelve la cantidad de items del badge del carrito.
     * Devuelve 0 si el badge no está visible (carrito vacío).
     */
    async getCartItemsCount(): Promise<number> {
        const badge = this.locators.cartBadge();
        if (await badge.isVisible()) {
            const text = await badge.textContent();
            return parseInt(text ?? '0', 10);
        }
        return 0;
    }

    /**
     * Verifica que el badge del carrito muestre la cantidad esperada.
     */
    async assertCartBadgeCount(expected: number): Promise<void> {
        if (expected === 0) {
            await expect(this.locators.cartBadge(), 'Cart badge should not be visible when empty').toBeHidden();
        } else {
            await expect(this.locators.cartBadge(), `Cart badge should show ${expected}`).toHaveText(expected.toString());
        }
    }

    /**
     * Abre el menú hamburguesa.
     */
    async openBurgerMenu(): Promise<void> {
        await this.locators.burgerMenuButton().click();
        await this.locators.logoutLink().waitFor({ state: 'visible' });
    }

    /**
     * Cierra sesión desde el menú hamburguesa.
     */
    async logout(): Promise<void> {
        await this.openBurgerMenu();
        await this.locators.logoutLink().click();
    }

    /**
     * Resetea el estado de la app (limpia carrito) desde el menú.
     */
    async resetAppState(): Promise<void> {
        await this.openBurgerMenu();
        await this.locators.resetAppStateLink().click();
        await this.locators.closeMenuButton().click();
    }

    /**
     * Verifica que el header esté visible (logo y carrito).
     */
    async assertHeaderVisible(): Promise<void> {
        await expect(this.locators.appLogo(), 'Expected app logo to be visible').toBeVisible();
        await expect(this.locators.cartIcon(), 'Expected cart icon to be visible').toBeVisible();
    }
}