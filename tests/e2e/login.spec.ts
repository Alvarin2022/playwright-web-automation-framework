import { test, expect } from '../../src/fixtures/baseTest';
import { URLS } from '../../src/config/urls';
import { log } from '../../src/Helpers/Logger';
import {
    POSITIVE_LOGIN_SCENARIOS,
    NEGATIVE_LOGIN_SCENARIOS,
} from '../../src/data/loginScenarios';

test.describe('Login Tests @login', () => {

    /* ============================================================
     * POSITIVE SCENARIOS - Data-driven
     * Un solo bloque de test corre N veces, una por cada escenario.
     * ============================================================ */
    POSITIVE_LOGIN_SCENARIOS.forEach((scenario) => {
        const tagString = scenario.tags?.join(' ') ?? '';
        test(`${scenario.description} ${tagString}`, async ({ page, loginPage, config }) => {
            log.step(scenario.description, 'Starting positive login test');

            // Arrange
            const credentials = config.getCredentialsFor(scenario.userType!);

            // Act
            await loginPage.goto();
            await loginPage.assertLoginScreenVisible();
            await loginPage.login(credentials.username, credentials.password);

            // Assert
            await expect(page, 'Should redirect to inventory page after successful login')
                .toHaveURL(new RegExp(URLS.INVENTORY));

            log.info(`✅ Login successful for ${scenario.userType}`);
        });
    });

    /* ============================================================
     * NEGATIVE SCENARIOS - Data-driven
     * ============================================================ */
    NEGATIVE_LOGIN_SCENARIOS.forEach((scenario) => {
        const tagString = scenario.tags?.join(' ') ?? '';
        test(`${scenario.description} ${tagString}`, async ({ loginPage, config }) => {
            log.step(scenario.description, 'Starting negative login test');

            // Arrange - resuelve credenciales según el tipo de escenario
            const username = scenario.userType
                ? config.getCredentialsFor(scenario.userType).username
                : scenario.customUsername ?? '';
            const password = scenario.userType
                ? config.getCredentialsFor(scenario.userType).password
                : scenario.customPassword ?? '';

            // Act
            await loginPage.goto();
            await loginPage.assertLoginScreenVisible();
            await loginPage.login(username, password);

            // Assert
            await loginPage.assertErrorMessage(scenario.expectedErrorMessage!);

            log.info(`✅ Expected error displayed: "${scenario.expectedErrorMessage}"`);
        });
    });

});