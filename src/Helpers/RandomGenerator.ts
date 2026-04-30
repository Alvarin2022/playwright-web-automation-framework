/**
 * Devuelve un elemento aleatorio de un array.
 * Retorna undefined si el array está vacío.
 */
export function getRandomFromArray<T>(array: readonly T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Genera un número aleatorio entero entre min y max (ambos incluidos).
 */
export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera un email aleatorio para datos de prueba.
 */
export function getRandomEmail(): string {
    const timestamp = Date.now();
    const random = getRandomNumber(1000, 9999);
    return `qa.test+${timestamp}${random}@example.com`;
}

/**
 * Genera un nombre y apellido random a partir de listas predefinidas.
 */
export function getRandomName(): string {
    const firstNames = ['John', 'Jane', 'Carlos', 'Maria', 'Alex', 'Sofia', 'Diego', 'Emma'];
    const lastNames = ['Smith', 'Garcia', 'Rodriguez', 'Johnson', 'Lopez', 'Martinez', 'Brown'];
    const firstName = getRandomFromArray(firstNames) ?? 'John';
    const lastName1 = getRandomFromArray(lastNames) ?? 'Smith';
    const lastName2 = getRandomFromArray(lastNames) ?? 'Doe';
    return `${firstName} ${lastName1} ${lastName2}`;
}

/**
 * Genera un código postal random de 5 dígitos.
 */
export function getRandomZipCode(): string {
    return getRandomNumber(10000, 99999).toString();
}