import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';

export class CheckoutInfoPage {
    private locators: Locators;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
    }

    async assertCheckoutInfoScreenVisible(): Promise<void> {
        await expect(this.locators.pageTitle(), 'Expected page title to be Checkout: Your Information').toHaveText('Checkout: Your Information');
        await expect(this.locators.firstNameInput(), 'Expected First Name input to be visible').toBeVisible();
        await expect(this.locators.lastNameInput(), 'Expected Last Name input to be visible').toBeVisible();
        await expect(this.locators.postalCodeInput(), 'Expected Postal Code input to be visible').toBeVisible();
    }

    /**
     * Llena los datos del formulario.
     */
    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.locators.firstNameInput().fill(firstName);
        await this.locators.lastNameInput().fill(lastName);
        await this.locators.postalCodeInput().fill(postalCode);
    }

    async clickContinue(): Promise<void> {
        await this.locators.continueButton().click();
    }

    async clickCancel(): Promise<void> {
        await this.locators.cancelButton().click();
    }

    async assertErrorMessage(expected: string): Promise<void> {
        await expect(this.locators.errorMessage(), `Expected error to contain "${expected}"`).toContainText(expected);
    }
}