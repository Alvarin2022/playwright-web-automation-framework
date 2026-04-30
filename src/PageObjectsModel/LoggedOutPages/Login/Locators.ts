import { Page } from '@playwright/test';

export class Locators {
    constructor(private page: Page) {
        this.page = page;
    }

    /* Login Form */
    usernameInput = () => this.page.locator('[data-test="username"]');
    passwordInput = () => this.page.locator('[data-test="password"]');
    loginButton = () => this.page.locator('[data-test="login-button"]');

    /* Branding */
    loginLogo = () => this.page.locator('.login_logo');
    botColumn = () => this.page.locator('.bot_column');

    /* Error Handling */
    errorMessage = () => this.page.locator('[data-test="error"]');
    errorCloseButton = () => this.page.locator('.error-button');

    /* Credentials Helper Boxes (visibles en SauceDemo) */
    loginCredentialsBox = () => this.page.locator('#login_credentials');
    loginPasswordBox = () => this.page.locator('.login_password');
}