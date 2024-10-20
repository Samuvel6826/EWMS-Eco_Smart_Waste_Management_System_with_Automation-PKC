// utils/logger.js
const winston = require('winston');

// Configure colors for log levels
winston.addColors({
    error: 'bold red',
    warn: 'italic yellow',
    info: 'green',
    http: 'cyan',
    debug: 'magenta',
});

// Format date for logs
const getFormattedDate = () => {
    const DateTime = require('luxon').DateTime; // Import DateTime here to avoid circular dependency
    return DateTime.now().setZone('Asia/Kolkata').toFormat('dd/MM/yyyy, hh:mm:ss a').toUpperCase();
};

// Configure Winston logger with colors and formatted timestamp
const logger = winston.createLogger({
    level: 'info',
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.colorize(),  // Apply colors to log levels
        winston.format.timestamp({
            format: getFormattedDate // Use the date format function defined in this file
        }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
            let msg = `${timestamp} [${level}]: ${message} `;
            if (metadata && Object.keys(metadata).length) { // Only include metadata if it exists
                msg += JSON.stringify(metadata);
            }
            return msg;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

module.exports = { logger };