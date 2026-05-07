import { test, expect } from '../../src/fixtures/baseTest';
import { PRODUCTS } from '../../src/Calls/Constants';
import { URLS } from '../../src/config/urls';
import { log } from '../../src/Helpers/Logger';

test.describe('Purchase Flow @purchase', () => {

    test('Should complete a full purchase with multiple products @smoke @e2e', async ({
        page,
        loggedInUser,        // ← login automático, datos del usuario disponibles
        inventoryPage,
        cartPage,
        checkoutInfoPage,
        checkoutOverviewPage,
        checkoutCompletePage,
        newUserSession,      // ← datos de usuario "fresco" para checkout
    }) => {
        const productsToBuy = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT, PRODUCTS.BOLT_TSHIRT];

        log.step('Full Purchase E2E', 'Adding products to cart');
        await inventoryPage.addMultipleProductsToCart(productsToBuy);
        await inventoryPage.header.assertCartBadgeCount(productsToBuy.length);

        log.step('Full Purchase E2E', 'Navigating to cart');
        await inventoryPage.header.goToCart();
        await cartPage.assertCartScreenVisible();
        await cartPage.assertProductsInCart(productsToBuy);

        log.step('Full Purchase E2E', 'Filling checkout information');
        await cartPage.proceedToCheckout();
        await checkoutInfoPage.assertCheckoutInfoScreenVisible();
        await checkoutInfoPage.fillCheckoutInformation(
            newUserSession.firstName,
            newUserSession.lastName,
            newUserSession.postalCode
        );
        await checkoutInfoPage.clickContinue();

        log.step('Full Purchase E2E', 'Validating overview and finishing');
        await checkoutOverviewPage.assertOverviewScreenVisible();
        await checkoutOverviewPage.assertProductsInOverview(productsToBuy);
        await checkoutOverviewPage.assertTotalsAreConsistent();
        await checkoutOverviewPage.clickFinish();

        log.step('Full Purchase E2E', 'Confirming order');
        await checkoutCompletePage.assertOrderConfirmed();
        await expect(page).toHaveURL(new RegExp(URLS.CHECKOUT_COMPLETE));

        log.info(`🎉 Purchase completed for ${newUserSession.firstName} ${newUserSession.lastName}`);
    });

    test('Should remove a product from cart before checkout', async ({
        loggedInUser,
        inventoryPage,
        cartPage,
    }) => {
        await inventoryPage.addMultipleProductsToCart([PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT]);
        await inventoryPage.header.assertCartBadgeCount(2);

        await inventoryPage.header.goToCart();
        await cartPage.assertCartScreenVisible();
        await cartPage.removeProduct(PRODUCTS.BACKPACK);
        await cartPage.assertProductsInCart([PRODUCTS.BIKE_LIGHT]);
        await cartPage.header.assertCartBadgeCount(1);
    });

    test('Should display error when checkout info is incomplete', async ({
        loggedInUser,
        inventoryPage,
        cartPage,
        checkoutInfoPage,
    }) => {
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