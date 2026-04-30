import { Page } from '@playwright/test';

export class Locators {
    constructor(private page: Page) {
        this.page = page;
    }

    pageTitle = () => this.page.locator('[data-test="title"]');
    completeHeader = () => this.page.locator('[data-test="complete-header"]');
    completeText = () => this.page.locator('[data-test="complete-text"]');
    ponyExpressImage = () => this.page.locator('[data-test="pony-express"]');
    backHomeButton = () => this.page.locator('[data-test="back-to-products"]');
}