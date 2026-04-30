import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';

export class CheckoutCompletePage {
    private locators: Locators;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
    }

    async assertOrderConfirmed(): Promise<void> {
        await expect(this.locators.pageTitle(), 'Expected page title to be Checkout: Complete!').toHaveText('Checkout: Complete!');
        await expect(this.locators.completeHeader(), 'Expected complete header to confirm order').toContainText('Thank you for your order');
        await expect(this.locators.ponyExpressImage(), 'Expected pony express image to be visible').toBeVisible();
        await expect(this.locators.backHomeButton(), 'Expected Back Home button to be visible').toBeVisible();
    }

    async clickBackHome(): Promise<void> {
        await this.locators.backHomeButton().click();
    }
}