import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';
import { configurator } from '../../../Configuration/Configurator';
import { URLS } from '../../../config/urls';
import { Allure } from '../../../Helpers/AllureSteps';

export class LoginPage {
    private locators: Locators;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
    }

    async goto(): Promise<void> {
        await Allure.step('Navigate to Login page', async () => {
            await this.page.goto(configurator.getBaseUrl() + URLS.LOGIN);
            await this.locators.loginLogo().waitFor({ state: 'visible', timeout: 10000 });
        });
    }

    async login(username: string, password: string): Promise<void> {
        await Allure.step(`Login with username: "${username}"`, async () => {
            await this.locators.usernameInput().click();
            await this.locators.usernameInput().fill(username);
            await this.locators.passwordInput().click();
            await this.locators.passwordInput().fill(password);
            await this.locators.loginButton().click();
        });
    }

    async assertLoginScreenVisible(): Promise<void> {
        await Allure.step('Verify Login screen is visible', async () => {
            await expect(this.locators.loginLogo(), 'Expected SauceDemo login logo to be visible').toBeVisible();
            await expect(this.locators.usernameInput(), 'Expected username input to be visible').toBeVisible();
            await expect(this.locators.passwordInput(), 'Expected password input to be visible').toBeVisible();
            await expect(this.locators.loginButton(), 'Expected login button to be visible').toBeVisible();
        });
    }

    async assertErrorMessage(expectedMessage: string): Promise<void> {
        await Allure.step(`Verify error message contains: "${expectedMessage}"`, async () => {
            const errorLocator = this.locators.errorMessage();
            await expect(errorLocator, 'Expected error message to be visible').toBeVisible({ timeout: 10000 });
            await expect(errorLocator, `Expected error message to contain "${expectedMessage}"`).toContainText(expectedMessage);
        });
    }

    async closeErrorMessage(): Promise<void> {
        await Allure.step('Close error banner', async () => {
            const closeButton = this.locators.errorCloseButton();
            if (await closeButton.isVisible()) {
                await closeButton.click();
            }
        });
    }

    async getErrorMessageText(): Promise<string> {
        await this.locators.errorMessage().waitFor({ state: 'visible' });
        return (await this.locators.errorMessage().textContent()) ?? '';
    }
}