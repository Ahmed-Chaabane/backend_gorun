// utils/logger.js
const winston = require('winston');

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
    level: 'info', // Niveau de log (vous pouvez utiliser 'debug', 'warn', 'error', etc.)
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        // Log dans la console
        new winston.transports.Console({ format: winston.format.simple() }),

        // Log dans un fichier
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});

module.exports = logger;
