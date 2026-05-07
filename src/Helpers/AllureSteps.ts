import * as allure from 'allure-js-commons';

/**
 * Helpers para enriquecer los reportes de Allure.
 * Usa la API oficial de allure-js-commons (v3).
 */
export const Allure = {
    /**
     * Envuelve un bloque de código en un step de Allure.
     * El callback puede devolver un valor que se propaga.
     */
    step: async <T>(name: string, body: () => Promise<T>): Promise<T> => {
        return await allure.step(name, body);
    },

    /* === Test Metadata === */
    feature: async (name: string) => allure.feature(name),
    story: async (name: string) => allure.story(name),
    epic: async (name: string) => allure.epic(name),
    severity: async (level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') =>
        allure.severity(level),
    owner: async (name: string) => allure.owner(name),
    tag: async (tagName: string) => allure.tags(tagName),
    description: async (description: string) => allure.description(description),

    /* === Attachments === */
    attachText: async (name: string, content: string) => {
        await allure.attachment(name, content, { contentType: 'text/plain' });
    },
    attachJSON: async (name: string, data: unknown) => {
        await allure.attachment(name, JSON.stringify(data, null, 2), {
            contentType: 'application/json',
        });
    },

    /* === Parameters === */
    parameter: async (name: string, value: string) => allure.parameter(name, value),
};