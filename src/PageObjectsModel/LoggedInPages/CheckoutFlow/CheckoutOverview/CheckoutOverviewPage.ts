import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';

export class CheckoutOverviewPage {
    private locators: Locators;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
    }

    async assertOverviewScreenVisible(): Promise<void> {
        await expect(this.locators.pageTitle(), 'Expected page title to be Checkout: Overview').toHaveText('Checkout: Overview');
        await expect(this.locators.finishButton(), 'Expected Finish button to be visible').toBeVisible();
    }

    /**
     * Verifica que los productos esperados estén en el resumen.
     */
    async assertProductsInOverview(productNames: string[]): Promise<void> {
        await expect(this.locators.cartItems(), `Expected ${productNames.length} items in overview`).toHaveCount(productNames.length);
        const actualNames = await this.locators.itemNames().allTextContents();
        for (const expected of productNames) {
            expect(actualNames, `Expected product "${expected}" in overview`).toContain(expected);
        }
    }

    /**
     * Devuelve el subtotal como número (sin "Item total: $").
     */
    async getSubtotal(): Promise<number> {
        const text = await this.locators.subtotalLabel().textContent() ?? '';
        const match = text.match(/\$([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Devuelve el impuesto como número.
     */
    async getTax(): Promise<number> {
        const text = await this.locators.taxLabel().textContent() ?? '';
        const match = text.match(/\$([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Devuelve el total como número.
     */
    async getTotal(): Promise<number> {
        const text = await this.locators.totalLabel().textContent() ?? '';
        const match = text.match(/\$([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Verifica que subtotal + tax = total (validación de negocio).
     */
    async assertTotalsAreConsistent(): Promise<void> {
        const subtotal = await this.getSubtotal();
        const tax = await this.getTax();
        const total = await this.getTotal();
        const expectedTotal = parseFloat((subtotal + tax).toFixed(2));
        expect(total, `Total ($${total}) should equal subtotal ($${subtotal}) + tax ($${tax})`).toBe(expectedTotal);
    }

    async clickFinish(): Promise<void> {
        await this.locators.finishButton().click();
    }

    async clickCancel(): Promise<void> {
        await this.locators.cancelButton().click();
    }
}