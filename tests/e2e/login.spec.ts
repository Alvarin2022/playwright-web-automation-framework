import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/PageObjectsModel/LoggedOutPages/Login/LoginPage';
import { configurator } from '../../src/Configuration/Configurator';
import { URLS } from '../../src/config/urls';

test.describe('Login Tests @login', () => {

    test('Should login successfully with standard user @smoke', async ({ page }) => {
        // Arrange
        const loginPage = new LoginPage(page);
        const credentials = configurator.getCredentialsFor('STANDARD');

        await loginPage.goto();
        await loginPage.assertLoginScreenVisible();

        // Act
        await loginPage.login(credentials.username, credentials.password);

        // Assert
        await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
    });

    test('Should display error when logging in with locked user', async ({ page }) => {
        // Arrange
        const loginPage = new LoginPage(page);
        const credentials = configurator.getCredentialsFor('LOCKED');

        await loginPage.goto();
        await loginPage.assertLoginScreenVisible();

        // Act
        await loginPage.login(credentials.username, credentials.password);

        // Assert
        await loginPage.assertErrorMessage('Sorry, this user has been locked out');
    });

    test('Should display error when password is empty', async ({ page }) => {
        // Arrange
        const loginPage = new LoginPage(page);
        const credentials = configurator.getCredentialsFor('STANDARD');

        await loginPage.goto();

        // Act
        await loginPage.login(credentials.username, '');

        // Assert
        await loginPage.assertErrorMessage('Password is required');
    });

    test('Should display error when username is empty', async ({ page }) => {
        // Arrange
        const loginPage = new LoginPage(page);
        const credentials = configurator.getCredentialsFor('STANDARD');

        await loginPage.goto();

        // Act
        await loginPage.login('', credentials.password);

        // Assert
        await loginPage.assertErrorMessage('Username is required');
    });

});