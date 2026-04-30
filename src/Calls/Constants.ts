/**
 * Constantes globales del framework.
 * Todos los valores que se repiten en el proyecto se centralizan acá.
 */

export const USER_TYPES = {
    STANDARD: 'standard_user',
    LOCKED: 'locked_out_user',
    PROBLEM: 'problem_user',
    PERFORMANCE: 'performance_glitch_user',
    ERROR: 'error_user',
    VISUAL: 'visual_user',
} as const;

export const ENVIRONMENTS = {
    PROD: 'PROD',
    QA: 'QA',
    UAT: 'UAT',
} as const;

export const LANGUAGE = {
    ENGLISH: 'English',
    SPANISH: 'Español',
} as const;

export const BROWSERS = {
    CHROMIUM: 'chromium',
    FIREFOX: 'firefox',
    WEBKIT: 'webkit',
} as const;

/**
 * Mapeo de credenciales por entorno y tipo de usuario.
 * Estructura: Credentials[`${userType}_${environment}`]
 */
export const Credentials = {
    STANDARD_PROD: {
        user: {
            username: USER_TYPES.STANDARD,
            password: 'secret_sauce',
        },
    },
    LOCKED_PROD: {
        user: {
            username: USER_TYPES.LOCKED,
            password: 'secret_sauce',
        },
    },
    PROBLEM_PROD: {
        user: {
            username: USER_TYPES.PROBLEM,
            password: 'secret_sauce',
        },
    },
    PERFORMANCE_PROD: {
        user: {
            username: USER_TYPES.PERFORMANCE,
            password: 'secret_sauce',
        },
    },
    ERROR_PROD: {
        user: {
            username: USER_TYPES.ERROR,
            password: 'secret_sauce',
        },
    },
    VISUAL_PROD: {
        user: {
            username: USER_TYPES.VISUAL,
            password: 'secret_sauce',
        },
    },
} as const;
/**
 * Catálogo de productos disponibles en SauceDemo.
 * Centralizar los nombres evita strings mágicos en los tests.
 */
export const PRODUCTS = {
    BACKPACK: 'Sauce Labs Backpack',
    BIKE_LIGHT: 'Sauce Labs Bike Light',
    BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
    FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
    ONESIE: 'Sauce Labs Onesie',
    RED_TSHIRT: 'Test.allTheThings() T-Shirt (Red)',
} as const;

export type ProductName = typeof PRODUCTS[keyof typeof PRODUCTS];

export const URLS_BY_ENV = {
    PROD: 'https://www.saucedemo.com',
    QA: 'https://www.saucedemo.com',
    UAT: 'https://www.saucedemo.com',
} as const;