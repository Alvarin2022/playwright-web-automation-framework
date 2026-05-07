import winston from 'winston';
import path from 'path';
import fs from 'fs';

/**
 * Sistema de logging centralizado del framework.
 * Genera logs con timestamps, niveles y los persiste en archivos por corrida.
 *
 * Niveles disponibles (orden de severidad):
 * - error: errores críticos
 * - warn: advertencias, comportamientos inesperados pero no críticos
 * - info: información de flujo (default para acciones de tests)
 * - debug: información detallada de debugging
 */

const LOG_DIR = path.resolve(process.cwd(), 'logs');

// Asegurar que la carpeta de logs exista
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        return stack ? `${base}\n${stack}` : base;
    })
);

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

// Nombre del archivo de log con timestamp para identificar cada corrida
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(LOG_DIR, `test-run-${runTimestamp}.log`);

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({
            filename: logFile,
            options: { flags: 'a' },
        }),
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'errors.log'),
            level: 'error',
        }),
    ],
});

/**
 * Helpers semánticos para usar en los tests y page objects.
 */
export const log = {
    info: (message: string) => logger.info(message),
    warn: (message: string) => logger.warn(message),
    error: (message: string, error?: Error) => {
        if (error) {
            logger.error(`${message}: ${error.message}`, { stack: error.stack });
        } else {
            logger.error(message);
        }
    },
    debug: (message: string) => logger.debug(message),
    step: (testName: string, stepDescription: string) => {
        logger.info(`[${testName}] ▶ ${stepDescription}`);
    },
};