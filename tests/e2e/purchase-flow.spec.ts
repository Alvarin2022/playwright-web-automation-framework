import { test, expect } from '../../src/fixtures/baseTest';
import { PRODUCTS } from '../../src/Calls/Constants';
import { URLS } from '../../src/config/urls';
import { log } from '../../src/Helpers/Logger';
import { Allure } from '../../src/Helpers/AllureSteps';

test.describe('Purchase Flow @purchase', () => {

    test.beforeEach(async () => {
        await Allure.epic('E-commerce');
        await Allure.feature('Purchase Flow');
    });

    test('Should complete a full purchase with multiple products @smoke @e2e', async ({
        page,
        loggedInUser,
        inventoryPage,
        cartPage,
        checkoutInfoPage,
        checkoutOverviewPage,
        checkoutCompletePage,
        newUserSession,
    }) => {
        await Allure.story('End-to-End Purchase');
        await Allure.severity('blocker');
        await Allure.description('Validates the complete purchase flow: login → product selection → cart → checkout → confirmation.');
        await Allure.parameter('Customer', `${newUserSession.firstName} ${newUserSession.lastName}`);
        await Allure.parameter('Postal Code', newUserSession.postalCode);

        const productsToBuy = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT, PRODUCTS.BOLT_TSHIRT];
        await Allure.attachJSON('Products to buy', productsToBuy);

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
        await Allure.story('Cart Management');
        await Allure.severity('critical');

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
        await Allure.story('Checkout Validations');
        await Allure.severity('critical');
        await Allure.description('Validates that mandatory fields trigger errors during checkout.');

        await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
        await inventoryPage.header.goToCart();
        await cartPage.proceedToCheckout();

        await checkoutInfoPage.clickContinue();
        await checkoutInfoPage.assertErrorMessage('First Name is required');

        await checkoutInfoPage.fillCheckoutInformation('John', '', '');
        await checkoutInfoPage.clickContinue();
        await checkoutInfoPage.assertErrorMessage('Last Name is required');
    });

});