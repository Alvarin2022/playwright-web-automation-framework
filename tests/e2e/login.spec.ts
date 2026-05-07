import { test, expect } from '../../src/fixtures/baseTest';
import { URLS } from '../../src/config/urls';
import { log } from '../../src/Helpers/Logger';
import { Allure } from '../../src/Helpers/AllureSteps';
import {
    POSITIVE_LOGIN_SCENARIOS,
    NEGATIVE_LOGIN_SCENARIOS,
} from '../../src/data/loginScenarios';

test.describe('Login Tests @login', () => {

    test.beforeEach(async () => {
        await Allure.epic('Authentication');
        await Allure.feature('Login');
    });

    /* === POSITIVE SCENARIOS === */
    POSITIVE_LOGIN_SCENARIOS.forEach((scenario) => {
        const tagString = scenario.tags?.join(' ') ?? '';
        test(`${scenario.description} ${tagString}`, async ({ page, loginPage, config }) => {
            await Allure.story('Successful Login');
            await Allure.severity(scenario.userType === 'STANDARD' ? 'blocker' : 'normal');
            await Allure.parameter('User Type', scenario.userType ?? 'N/A');
            await Allure.description(`Validates that a user of type ${scenario.userType} can log in successfully and lands on the inventory page.`);

            log.step(scenario.description, 'Starting positive login test');

            const credentials = config.getCredentialsFor(scenario.userType!);

            await loginPage.goto();
            await loginPage.assertLoginScreenVisible();
            await loginPage.login(credentials.username, credentials.password);

            await expect(page, 'Should redirect to inventory page after successful login')
                .toHaveURL(new RegExp(URLS.INVENTORY));

            log.info(`✅ Login successful for ${scenario.userType}`);
        });
    });

    /* === NEGATIVE SCENARIOS === */
    NEGATIVE_LOGIN_SCENARIOS.forEach((scenario) => {
        const tagString = scenario.tags?.join(' ') ?? '';
        test(`${scenario.description} ${tagString}`, async ({ loginPage, config }) => {
            await Allure.story('Login Validations');
            await Allure.severity('critical');
            await Allure.parameter('Expected Error', scenario.expectedErrorMessage ?? 'N/A');
            await Allure.description(`Validates that the login fails with the expected error: ${scenario.expectedErrorMessage}`);

            log.step(scenario.description, 'Starting negative login test');

            const username = scenario.userType
                ? config.getCredentialsFor(scenario.userType).username
                : scenario.customUsername ?? '';
            const password = scenario.userType
                ? config.getCredentialsFor(scenario.userType).password
                : scenario.customPassword ?? '';

            await loginPage.goto();
            await loginPage.assertLoginScreenVisible();
            await loginPage.login(username, password);

            await loginPage.assertErrorMessage(scenario.expectedErrorMessage!);

            log.info(`✅ Expected error displayed: "${scenario.expectedErrorMessage}"`);
        });
    });

});