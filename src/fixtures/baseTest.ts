import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../PageObjectsModel/LoggedOutPages/Login/LoginPage';
import { InventoryPage } from '../PageObjectsModel/LoggedInPages/Inventory/InventoryPage';
import { CartPage } from '../PageObjectsModel/LoggedInPages/Cart/CartPage';
import { CheckoutInfoPage } from '../PageObjectsModel/LoggedInPages/CheckoutFlow/CheckoutInfo/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../PageObjectsModel/LoggedInPages/CheckoutFlow/CheckoutOverview/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../PageObjectsModel/LoggedInPages/CheckoutFlow/CheckoutComplete/CheckoutCompletePage';
import { configurator, Configurator } from '../Configuration/Configurator';
import { UserType } from '../Configuration/Configurator';
import { getRandomEmail, getRandomName, getRandomZipCode } from '../Helpers/RandomGenerator';
import { log } from '../Helpers/Logger';

/**
 * Datos de un usuario de sesión (existente o creado al vuelo).
 */
export interface SessionUser {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    postalCode: string;
}

/**
 * Define las fixtures custom disponibles en los tests.
 * Cada fixture es inyectada automáticamente cuando un test la solicita
 * en su lista de parámetros.
 */
type TestFixtures = {
    /* Configuration */
    config: Configurator;

    /* Page Objects (sin login - sesión limpia) */
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutInfoPage: CheckoutInfoPage;
    checkoutOverviewPage: CheckoutOverviewPage;
    checkoutCompletePage: CheckoutCompletePage;

    /* User Session Modes */
    sessionUser: SessionUser;
    loggedInUser: SessionUser;
    newUserSession: SessionUser;
};

/**
 * Genera datos de usuario "frescos" para tests que necesitan datos únicos.
 * Simula la creación de un usuario nuevo. En SauceDemo no se pueden crear
 * usuarios reales, así que usamos las credenciales standard pero con datos
 * de checkout únicos en cada corrida.
 */
function generateNewUserSession(): SessionUser {
    const fullName = getRandomName();
    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ')[1];
    const credentials = configurator.getCredentialsFor('STANDARD');

    return {
        username: credentials.username,
        password: credentials.password,
        firstName,
        lastName,
        email: getRandomEmail(),
        postalCode: getRandomZipCode(),
    };
}

/**
 * Devuelve los datos de un usuario existente preconfigurado.
 */
function getExistingUserSession(userType: UserType = 'STANDARD'): SessionUser {
    const credentials = configurator.getCredentialsFor(userType);
    return {
        username: credentials.username,
        password: credentials.password,
        firstName: 'QA',
        lastName: 'Tester',
        email: 'qa.tester@example.com',
        postalCode: '12345',
    };
}

/**
 * Test extendido con fixtures custom del framework.
 *
 * USO:
 *   import { test, expect } from '@fixtures/baseTest';
 *
 *   test('mi test', async ({ inventoryPage, loggedInUser }) => {
 *     // Ya está logueado y las pages están instanciadas
 *   });
 */
export const test = base.extend<TestFixtures>({

    /* === CONFIG === */
    config: async ({}, use) => {
        await use(configurator);
    },

    /* === PAGE OBJECTS === */
    // Estas fixtures solo instancian las pages, no hacen login.
    // Útiles para tests que validan flujos pre-login (ej: errores de login).
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutInfoPage: async ({ page }, use) => {
        await use(new CheckoutInfoPage(page));
    },

    checkoutOverviewPage: async ({ page }, use) => {
        await use(new CheckoutOverviewPage(page));
    },

    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page));
    },

    /* === SESSION MODES === */

    /**
     * Datos de un usuario existente (sin hacer login automático).
     * El test puede usar estos datos para hacer login manualmente.
     */
    sessionUser: async ({}, use) => {
        const userData = getExistingUserSession('STANDARD');
        log.info(`📋 sessionUser created with username: ${userData.username}`);
        await use(userData);
    },

    /**
     * Genera datos NUEVOS y únicos para cada test que la pida.
     * Útil para tests que necesitan datos limpios o validar
     * que se generen sin colisiones.
     */
    newUserSession: async ({}, use) => {
        const userData = generateNewUserSession();
        log.info(`🆕 newUserSession created: ${userData.firstName} ${userData.lastName} (${userData.email})`);
        await use(userData);
    },

    /**
     * Realiza login automáticamente y deja al usuario en la página
     * de inventario. Usar en tests que requieren estar logueados.
     */
    loggedInUser: async ({ page, loginPage, inventoryPage }, use) => {
        const userData = getExistingUserSession('STANDARD');
        log.step('loggedInUser fixture', `Logging in as ${userData.username}`);

        await loginPage.goto();
        await loginPage.login(userData.username, userData.password);
        await inventoryPage.assertInventoryScreenVisible();

        log.info(`✅ Login successful for ${userData.username}`);
        await use(userData);
        log.info(`🚪 Test finished for session user ${userData.username}`);
    },
});

export { expect };