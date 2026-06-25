const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),        // Saves logs with timestamp
        format.json()                                               // Saves Logs in Json for parsing
    ),
    transports: [
        // Writes all warns, and errors to error.log file
        new transports.File({
            filename: path.join(__dirname, 'logs', 'error.log'),
            level: 'warn',                                                          // Push wanr and error logs to error file
        }),
        // Writes all info logs to info.log file
        new transports.File({
            filename: path.join(__dirname, 'logs', 'info.log'),
            level: 'info',
            format: format.combine(
                format((info) => info.level === 'info' ? info : false)()            // Only push info logs to info file strict
            )
        }),
        new transports.File({
            filename: path.join(__dirname, 'logs', 'debug.log'),
            level: 'debug',
            format:
                format((info) => info.level === 'debug' ? info : false)()           // Only push debug logs to debug file strict
        }),
    ]
});

if (process.env.ENV === 'production') {
    logger.add(new transports.Console({
        level: 'info',
        format: format.combine(
            format.colorize(),
            format.simple(),
        )
    }));
}

module.exports = { logger };