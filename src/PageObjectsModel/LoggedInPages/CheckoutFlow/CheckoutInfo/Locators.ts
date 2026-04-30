import { Page } from '@playwright/test';

export class Locators {
    constructor(private page: Page) {
        this.page = page;
    }

    pageTitle = () => this.page.locator('[data-test="title"]');
    firstNameInput = () => this.page.locator('[data-test="firstName"]');
    lastNameInput = () => this.page.locator('[data-test="lastName"]');
    postalCodeInput = () => this.page.locator('[data-test="postalCode"]');
    cancelButton = () => this.page.locator('[data-test="cancel"]');
    continueButton = () => this.page.locator('[data-test="continue"]');
    errorMessage = () => this.page.locator('[data-test="error"]');
}