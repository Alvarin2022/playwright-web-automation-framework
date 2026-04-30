import { Page, expect } from '@playwright/test';
import { Locators } from './Locators';
import { URLS } from '../../../config/urls';

export class LoginPage {
    private locators: Locators;

    constructor(private page: Page) {
        this.page = page;
        this.locators = new Locators(page);
    }

    /**
     * Navega a la página de login y espera a que el logo sea visible.
     */
    async goto(): Promise<void> {
        await this.page.goto(URLS.LOGIN);
        await this.locators.loginLogo().waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Realiza el flujo completo de login con las credenciales provistas.
     */
    async login(username: string, password: string): Promise<void> {
        await this.locators.usernameInput().click();
        await this.locators.usernameInput().fill(username);
        await this.locators.passwordInput().click();
        await this.locators.passwordInput().fill(password);
        await this.locators.loginButton().click();
    }

    /**
     * Verifica que la página de login esté completamente cargada.
     */
    async assertLoginScreenVisible(): Promise<void> {
        await expect(this.locators.loginLogo(), 'Expected SauceDemo login logo to be visible').toBeVisible();
        await expect(this.locators.usernameInput(), 'Expected username input to be visible').toBeVisible();
        await expect(this.locators.passwordInput(), 'Expected password input to be visible').toBeVisible();
        await expect(this.locators.loginButton(), 'Expected login button to be visible').toBeVisible();
    }

    /**
     * Verifica que se muestre un mensaje de error específico.
     */
    async assertErrorMessage(expectedMessage: string): Promise<void> {
        const errorLocator = this.locators.errorMessage();
        await expect(errorLocator, 'Expected error message to be visible').toBeVisible({ timeout: 10000 });
        await expect(errorLocator, `Expected error message to contain "${expectedMessage}"`).toContainText(expectedMessage);
    }

    /**
     * Cierra el banner de error si está visible.
     */
    async closeErrorMessage(): Promise<void> {
        const closeButton = this.locators.errorCloseButton();
        if (await closeButton.isVisible()) {
            await closeButton.click();
        }
    }

    /**
     * Obtiene el texto del mensaje de error.
     */
    async getErrorMessageText(): Promise<string> {
        await this.locators.errorMessage().waitFor({ state: 'visible' });
        return (await this.locators.errorMessage().textContent()) ?? '';
    }
}