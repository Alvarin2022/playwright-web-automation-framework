import { UserType } from '../Configuration/Configurator';

/**
 * Escenarios de login para data-driven testing.
 * Cada objeto representa un caso de prueba.
 */
export interface LoginScenario {
    description: string;
    userType: UserType | null; // null = credenciales custom (no de Constants)
    customUsername?: string;
    customPassword?: string;
    expectedOutcome: 'success' | 'error';
    expectedErrorMessage?: string;
    tags?: string[];
}

export const NEGATIVE_LOGIN_SCENARIOS: LoginScenario[] = [
    {
        description: 'should display error when logging in with locked user',
        userType: 'LOCKED',
        expectedOutcome: 'error',
        expectedErrorMessage: 'Sorry, this user has been locked out',
        tags: ['@negative', '@security'],
    },
    {
        description: 'should display error when password is empty',
        userType: null,
        customUsername: 'standard_user',
        customPassword: '',
        expectedOutcome: 'error',
        expectedErrorMessage: 'Password is required',
        tags: ['@negative', '@validation'],
    },
    {
        description: 'should display error when username is empty',
        userType: null,
        customUsername: '',
        customPassword: 'secret_sauce',
        expectedOutcome: 'error',
        expectedErrorMessage: 'Username is required',
        tags: ['@negative', '@validation'],
    },
    {
        description: 'should display error with invalid credentials',
        userType: null,
        customUsername: 'wrong_user',
        customPassword: 'wrong_password',
        expectedOutcome: 'error',
        expectedErrorMessage: 'Username and password do not match',
        tags: ['@negative', '@security'],
    },
    {
        description: 'should display error when both fields are empty',
        userType: null,
        customUsername: '',
        customPassword: '',
        expectedOutcome: 'error',
        expectedErrorMessage: 'Username is required',
        tags: ['@negative', '@validation'],
    },
];

export const POSITIVE_LOGIN_SCENARIOS: LoginScenario[] = [
    {
        description: 'should login successfully with standard user',
        userType: 'STANDARD',
        expectedOutcome: 'success',
        tags: ['@smoke', '@positive'],
    },
    {
        description: 'should login successfully with problem user',
        userType: 'PROBLEM',
        expectedOutcome: 'success',
        tags: ['@positive'],
    },
    {
        description: 'should login successfully with performance glitch user',
        userType: 'PERFORMANCE',
        expectedOutcome: 'success',
        tags: ['@positive', '@performance'],
    },
];