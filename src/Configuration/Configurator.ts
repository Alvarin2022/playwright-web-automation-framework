import * as dotenv from 'dotenv';
dotenv.config();

import { getRandomFromArray } from '../Helpers/RandomGenerator';
import {
    USER_TYPES,
    ENVIRONMENTS,
    LANGUAGE,
    BROWSERS,
    Credentials,
    URLS_BY_ENV,
} from '../Calls/Constants';

export type UserType = keyof typeof USER_TYPES;
export type Environment = keyof typeof ENVIRONMENTS;
export type Language = keyof typeof LANGUAGE;
export type Browser = keyof typeof BROWSERS;

const VALID_USER_TYPES = Object.keys(USER_TYPES) as UserType[];
const VALID_ENVIRONMENTS = Object.keys(ENVIRONMENTS) as Environment[];
const VALID_LANGUAGES = Object.keys(LANGUAGE) as Language[];
const VALID_BROWSERS = Object.keys(BROWSERS) as Browser[];

function isValidUserType(value: string): value is UserType {
    return VALID_USER_TYPES.includes(value as UserType);
}

function isValidEnvironment(value: string): value is Environment {
    return VALID_ENVIRONMENTS.includes(value as Environment);
}

function isValidLanguage(value: string): value is Language {
    return VALID_LANGUAGES.includes(value as Language);
}

function isValidBrowser(value: string): value is Browser {
    return VALID_BROWSERS.includes(value as Browser);
}

class Configurator {
    private readonly userType: UserType;
    private readonly environment: Environment;
    private readonly language: Language;
    private readonly browser: Browser;
    private readonly baseUrl: string;
    private readonly headless: boolean;
    private readonly defaultTimeout: number;

    private readonly sessionData: {
        username: string;
        password: string;
    };

    constructor(
        userType: UserType,
        environment: Environment,
        language: Language,
        browser: Browser
    ) {
        this.userType = userType;
        this.environment = environment;
        this.language = language;
        this.browser = browser;

        this.baseUrl = URLS_BY_ENV[environment];
        this.headless = process.env.HEADLESS !== 'false';
        this.defaultTimeout = parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10);

        const credentialsKey = `${userType}_${environment}` as keyof typeof Credentials;

        if (Credentials[credentialsKey]) {
            this.sessionData = Credentials[credentialsKey].user;
        } else {
            throw new Error(
                `No credentials found for ${userType} in ${environment}`
            );
        }
    }

    getUserType(): UserType {
        return this.userType;
    }

    getEnvironment(): Environment {
        return this.environment;
    }

    getLanguage(): Language {
        return this.language;
    }

    getBrowser(): Browser {
        return this.browser;
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    isHeadless(): boolean {
        return this.headless;
    }

    getDefaultTimeout(): number {
        return this.defaultTimeout;
    }

    getSessionData(): { username: string; password: string } {
        return this.sessionData;
    }

    /**
     * Permite obtener credenciales de un usuario específico distinto al configurado.
     * Útil para tests que necesitan probar varios tipos de usuario.
     */
    getCredentialsFor(userType: UserType): { username: string; password: string } {
        const key = `${userType}_${this.environment}` as keyof typeof Credentials;
        if (!Credentials[key]) {
            throw new Error(`No credentials found for ${userType} in ${this.environment}`);
        }
        return Credentials[key].user;
    }
}

function createConfiguratorFromPipeline(): Configurator {
    const userTypeRaw = (process.env.TEST_USER_TYPE ?? 'STANDARD').trim().toUpperCase();
    const environmentRaw = (process.env.TEST_ENVIRONMENT ?? 'PROD').trim().toUpperCase();
    const languageRaw = (process.env.TEST_LANGUAGE ?? 'ENGLISH').trim().toUpperCase();
    const browserRaw = (process.env.TEST_BROWSER ?? 'CHROMIUM').trim().toUpperCase();

    const userTypeFinal = isValidUserType(userTypeRaw)
        ? userTypeRaw
        : getRandomFromArray(VALID_USER_TYPES) ?? 'STANDARD';

    const environmentFinal = isValidEnvironment(environmentRaw)
        ? environmentRaw
        : 'PROD';

    const languageFinal = isValidLanguage(languageRaw)
        ? languageRaw
        : 'ENGLISH';

    const browserFinal = isValidBrowser(browserRaw)
        ? browserRaw
        : 'CHROMIUM';

    return new Configurator(userTypeFinal, environmentFinal, languageFinal, browserFinal);
}

const configurator = process.env.USE_PIPELINE_CONFIG === 'true'
    ? createConfiguratorFromPipeline()
    : new Configurator('STANDARD', 'PROD', 'ENGLISH', 'CHROMIUM');

export { configurator, Configurator, createConfiguratorFromPipeline };