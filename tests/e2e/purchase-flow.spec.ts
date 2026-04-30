import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/PageObjectsModel/LoggedOutPages/Login/LoginPage';
import { InventoryPage } from '../../src/PageObjectsModel/LoggedInPages/Inventory/InventoryPage';
import { CartPage } from '../../src/PageObjectsModel/LoggedInPages/Cart/CartPage';
import { CheckoutInfoPage } from '../../src/PageObjectsModel/LoggedInPages/CheckoutFlow/CheckoutInfo/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../../src/PageObjectsModel/LoggedInPages/CheckoutFlow/CheckoutOverview/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../src/PageObjectsModel/LoggedInPages/CheckoutFlow/CheckoutComplete/CheckoutCompletePage';
import { configurator } from '../../src/Configuration/Configurator';
import { PRODUCTS } from '../../src/Calls/Constants';
import { getRandomName, getRandomZipCode } from '../../src/Helpers/RandomGenerator';
import { URLS } from '../../src/config/urls';

test.describe('Purchase Flow @purchase', () => {

    test('Should complete a full purchase with multiple products @smoke @e2e', async ({ page }) => {
        // === Page instances ===
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutInfoPage = new CheckoutInfoPage(page);
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        const checkoutCompletePage = new CheckoutCompletePage(page);

        // === Test data ===
        const credentials = configurator.getCredentialsFor('STANDARD');
        const productsToBuy = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT, PRODUCTS.BOLT_TSHIRT];
        const fullName = getRandomName();
        const firstName = fullName.split(' ')[0];
        const lastName = fullName.split(' ')[1];
        const postalCode = getRandomZipCode();

        // === Step 1: Login ===
        await loginPage.goto();
        await loginPage.assertLoginScreenVisible();
        await loginPage.login(credentials.username, credentials.password);

        // === Step 2: Verify inventory and add products ===
        await inventoryPage.assertInventoryScreenVisible();
        await inventoryPage.assertProductsCount(6);
        await inventoryPage.addMultipleProductsToCart(productsToBuy);
        await inventoryPage.header.assertCartBadgeCount(productsToBuy.length);

        // === Step 3: Go to cart and validate ===
        await inventoryPage.header.goToCart();
        await cartPage.assertCartScreenVisible();
        await cartPage.assertProductsInCart(productsToBuy);

        // === Step 4: Checkout - Step 1 (info) ===
        await cartPage.proceedToCheckout();
        await checkoutInfoPage.assertCheckoutInfoScreenVisible();
        await checkoutInfoPage.fillCheckoutInformation(firstName, lastName, postalCode);
        await checkoutInfoPage.clickContinue();

        // === Step 5: Checkout - Step 2 (overview) ===
        await checkoutOverviewPage.assertOverviewScreenVisible();
        await checkoutOverviewPage.assertProductsInOverview(productsToBuy);
        await checkoutOverviewPage.assertTotalsAreConsistent();
        await checkoutOverviewPage.clickFinish();

        // === Step 6: Confirmation ===
        await checkoutCompletePage.assertOrderConfirmed();
        await expect(page).toHaveURL(new RegExp(URLS.CHECKOUT_COMPLETE));
    });

    test('Should remove a product from cart before checkout', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        const credentials = configurator.getCredentialsFor('STANDARD');

        await loginPage.goto();
        await loginPage.login(credentials.username, credentials.password);
        await inventoryPage.assertInventoryScreenVisible();

        await inventoryPage.addMultipleProductsToCart([PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT]);
        await inventoryPage.header.assertCartBadgeCount(2);

        await inventoryPage.header.goToCart();
        await cartPage.assertCartScreenVisible();
        await cartPage.removeProduct(PRODUCTS.BACKPACK);
        await cartPage.assertProductsInCart([PRODUCTS.BIKE_LIGHT]);
        await cartPage.header.assertCartBadgeCount(1);
    });

    test('Should display error when checkout info is incomplete', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutInfoPage = new CheckoutInfoPage(page);

        const credentials = configurator.getCredentialsFor('STANDARD');

        await loginPage.goto();
        await loginPage.login(credentials.username, credentials.password);
        await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
        await inventoryPage.header.goToCart();
        await cartPage.proceedToCheckout();

        // Intentar continuar sin llenar nada
        await checkoutInfoPage.clickContinue();
        await checkoutInfoPage.assertErrorMessage('First Name is required');

        // Llenar solo first name, falta last name
        await checkoutInfoPage.fillCheckoutInformation('John', '', '');
        await checkoutInfoPage.clickContinue();
        await checkoutInfoPage.assertErrorMessage('Last Name is required');
    });

});